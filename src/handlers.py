#!../../venv2_7/bin/python
#coding=utf-8

import re
import json
from tornado import web
from utils import *


class BaseHandler(web.RequestHandler):
    def initialize(self, redis):
        self.redis_obj = redis

    # TODO
    def __get_templates(self, project_name):
        project_str = self.redis_obj.get(redis_project_key(project_name))
        if project_str is not None:
            project = json.loads(project_str)


class IndexHandler(BaseHandler):
    def get(self):
        project_name = self.get_query_argument("project_name", "")
        self.render("index.html", form={"project_name": project_name, "project_type":"0"})

    def check_project_name(self, project_name):
        if re.match(r"^[a-zA-Z_][\w_]*$", project_name):
            return True
        return False

    def post(self):
        project_name = self.get_body_argument("project_name", "").strip()
        project_type = int(self.get_body_argument("project_type", "0"))
        create = self.get_body_argument("create_btn", None)
        commit = self.get_body_argument("commit_btn", None)

        if not self.check_project_name(project_name):
            msg = "project_name:[%s] is not legal!" % project_name
            self.render("index.html", form={"project_name":project_name, "message":msg, "project_type": str(project_type)})

        project_str = self.redis_obj.get(redis_project_key(project_name))
        # 创建新的抓取工程
        if create is not None:
            template_id = None
            if project_str is None:
                project = default_project(project_name)
                template_id = template_id_generator()
                template = default_template(project_name, template_id, project_type)
                project["main"] = template_id
                self.redis_obj.set(redis_project_key(project_name), json.dumps(project, indent=4))
                self.redis_obj.set(redis_template_key(template_id), json.dumps(template, indent=4))
            else:
                project = json.loads(project_str)
                template_id = project["main"]
            self.redirect("/template/%s" % template_id)

        if commit is not None:
            self.render("index.html", form={"project_name":project_name, "message":"", "project_type": str(project_type)})


class TemplateHandler(BaseHandler):
    def post(self):
        pass

    def get(self, template_id):
        template_str = self.redis_obj.get(redis_template_key(template_id))
        if template_str is None:
            self.send_error(404)

        template = json.loads(template_str)
        template_type = TemplateType(template["template_type"])

        # print template_type
        if template_type == TemplateType.LIST:
            self.render("list_tpl.html", form=dict(template=template, message=""))
        elif template_type == TemplateType.DETAIL:
            self.render("detail_tpl.html", form=dict(template=template, message=""))
        elif template_type == TemplateType.LISTDETAL:
            self.render("listdetail_tpl.html", form=dict(template=template, message=""))


class TemplateSaveHandler(BaseHandler):
    def get(self):
        pass

    def post(self):
        key = self.get_body_argument("key")
        value = self.get_body_argument("value")


class ProjectDeleteHandler(BaseHandler):
    def get(self, project_name):
        key = redis_project_key(project_name)
        resp = self.redis_obj.delete(key)
        self.set_status(200)
        self.write("succ")
        self.finish()

class TemplateDeleteHandler(BaseHandler):
    def get(self, template_id):
        key = redis_template_key(template_id)
        resp = self.redis_obj.delete(key)
        self.set_status(200)
        self.write("succ")
        self.finish()
