#!../../venv2_7/bin/python
#coding=utf-8

import time
from hashlib import md5
from enum import Enum

class TemplateType(Enum):
    LIST = 0
    DETAIL = 1
    LISTDETAL = 2

def redis_project_key(project_name):
    return "project_generator:project:%s" % project_name
def redis_template_key(template_id):
    return "project_generator:template:%s" % template_id

def default_project(project_name):
    return {
        "project_name": project_name,
        "main": None,
        "templates": []
    }

def default_template(project_name, template_id, template_type):
    return {
        "project_name": project_name,
        "template_type": template_type,
        "template_id": template_id,
        "template_name": template_name,
        "seed": {
            "seed_rexep": None,
        },
        "name": {
            "name_xpath": None,
            "name_default": None,
        },
        "host": {
            "host_default": None
        },
        "detail": {
            "detail_xpath": None,
            "detail_path": "$detail_xpath",
        },
        "next": None
    }

def template_id_generator():
    return md5(time.asctime()).hexdigest()

