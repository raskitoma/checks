# checks

Modified version of [HealthChecks Dasboard](https://github.com/healthchecks/dashboard), splitting files and adding custom self hosted servers as well.

# Installation

Pull site and upload to your web server.

Modify index.html and enter the proper values inside H1 element inside the div panel.  Each H1 element represents one service.

Fields to modify are:
- `data-readonly-key` represents the readonly API key generated on healthchecks.io or your self hosted healtchecks server.
- `data-server` represents the actual server, you need to put the healtchecks.io domain or your own self hosted domain.
