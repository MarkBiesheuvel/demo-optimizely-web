# Demo: Optimizely Web

This is a static web page to demonstrate the functionality of Optimizely Web. The buttons below are modified based on an experiment. Button presses are tracked as events.

## Setup

It is recommended to setup an CDK project in a Python virtual environment. This can easily be done with `venv`.

```sh
python3 -m venv .venv
```

To activate the virtual environment

```sh
source .venv/bin/activate
```

To install CDK libraries:

```sh
pip install -r cdk/requirements.txt
```

To deploy the CDK template:

```sh
cdk deploy
```
