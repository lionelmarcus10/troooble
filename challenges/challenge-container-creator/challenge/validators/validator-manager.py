#! /usr/bin/python3
import boto3, yaml, re, time

ssm = boto3.client("ssm", region_name="us-east-1")

def run_ssm_command(instance_id, command, user, timeout=30):
    """Run a shell command via AWS SSM as a specific user and show the command."""
    full_cmd = f"su - {user} -c \"{command}\""

    print(f"\n[Validator] Running on {instance_id} as {user}:\n> {full_cmd}\n")

    response = ssm.send_command(
        InstanceIds=[instance_id],
        DocumentName="AWS-RunShellScript",
        Parameters={"commands": [full_cmd]}
    )
    command_id = response["Command"]["CommandId"]

    # Poll until invocation is ready
    for _ in range(timeout):
        try:
            output = ssm.get_command_invocation(
                CommandId=command_id, InstanceId=instance_id
            )
            if output["Status"] in ["Success", "Failed", "Cancelled", "TimedOut"]:
                print(f"[Validator] Command Status: {output['Status']}")
                print(f"[Validator] Exit Code: {output['ResponseCode']}")
                return output.get("StandardOutputContent", "").strip()
        except ssm.exceptions.InvocationDoesNotExist:
            time.sleep(1)
            continue
        time.sleep(1)

    print("[Validator] Command timed out")
    return "timeout"



def check_output(actual, expected=None, pattern=None):
    if expected is not None:
        return actual.strip() == expected
    if pattern is not None:
        return re.match(pattern, actual.strip()) is not None
    return False

import re

def validate_output(v, stdout):
    """Validate stdout against expected_output or expected_pattern."""
    stdout_clean = stdout.strip()

    if "expected_output" in v:
        return stdout_clean == v["expected_output"], stdout_clean

    if "expected_pattern" in v:
        pattern = v["expected_pattern"]
        return bool(re.search(pattern, stdout_clean)), stdout_clean

    return False, stdout_clean


def run_validations(validator_file, instance_id, user):
    with open(validator_file, "r") as f:
        config = yaml.safe_load(f)

    results = []
    for step in config["step_validator"]:
        step_results = {"step": step["step"], "title": step["title"], "results": []}
        for v in step["validations"]:
            output = run_ssm_command(instance_id, v["command"], user, v.get("timeout", 30))
            passed, clean_out = validate_output(v, output)

            step_results["results"].append({
                "name": v["name"],
                "status": "PASS" if passed else "FAIL",
                "message": v["success_message"] if passed else v["failure_message"],
                "output": clean_out
            })
        results.append(step_results)
    return results



if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage: python validator-manager.py <validator_file> <instance_id> <user>")
        sys.exit(1)

    validator_file = sys.argv[1]
    instance_id = sys.argv[2]
    user = sys.argv[3]

    results = run_validations(validator_file, instance_id, user)
    for step in results:
        print(f"Step {step['step']}: {step['title']}")
        for v in step.get("results", []):
            print(f"  - {v['name']}: {v['status']}")
            print(f"    Message: {v['message']}")
            print(f"    Output: {v['output']}",end="\n\n")
        print()
