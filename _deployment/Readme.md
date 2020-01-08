TODO create staging server for temp tests
"test" folder use for autotests running under CI
in CI-build add env variable "CI=true"

Config directories:
- elk - Elastic Stack bundle for staging and production apps
- dev - for local development
- ci - for ci running
- test - for manual testing running, 1st stage
- staging - for manual testing, 2nd, pre-production stage
- production - final app production bundle
