#!/bin/bash

########################################### STEP 1: RESET FIREWALLD ##################################
# remove any existing firewalld configuration
sudo dnf remove firewalld
# Delete firewalld configuration files
sudo rm -rf /etc/firewalld /var/lib/firewalld /var/log/firewalld
# install firewalld if not present
sudo dnf install -y firewalld
sudo systemctl start firewalld

########################################### STEP 2: CONFIGURE FIREWALLD FOR DOCKER ##################################

# Trust Docker networks completely (internal communication)
firewall-cmd --permanent --zone=trusted --add-source=172.17.0.0/16
firewall-cmd --permanent --zone=trusted --add-source=172.18.0.0/16

# Add Docker interfaces to trusted zone
firewall-cmd --permanent --zone=trusted --add-interface=docker0 2>/dev/null || true
DOCKER_BRIDGES=$(ip link show | grep -o 'br-[a-f0-9]\+' | head -5)
for bridge in $DOCKER_BRIDGES; do
    firewall-cmd --permanent --zone=trusted --add-interface=$bridge 2>/dev/null || true
done

# ALLOW: Only port 80 from internet
firewall-cmd --permanent --zone=public --add-port=80/tcp
# Enable masquerading for Docker containers to access internet
firewall-cmd --permanent --zone=public --add-masquerade

# EXCEPTION: Allow localhost to access everything (for testing and management)
firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 source address=127.0.0.1 accept'
# BLOCK: All access to Docker container networks
firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 destination address=172.17.0.0/16 reject'
firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 destination address=172.18.0.0/16 reject'

# ALLOW: Only port 80 to Docker networks (exception to the above reject rules)
firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 destination address=172.17.0.0/16 port port=80 protocol=tcp accept'
firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 destination address=172.18.0.0/16 port port=80 protocol=tcp accept'

firewall-cmd --reload