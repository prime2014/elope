#!/bin/bash

top_path=/var/lib/jenkins/workspace/Elope
code_path=${top_path}
venv_path=${top_path}/venv
tasks_project_dir=${code_path}/$1
start_tests_dir=${code_path}/$2
results_dir=$3

export LC_ALL=en_US.utf-8
export LANG=en_US.utf-8




# install project
pip install -e ${tasks_project_dir}


# run tests
cd ${start_tests_dir}
pytest --junit-xml=${results_dir}/results.xml
