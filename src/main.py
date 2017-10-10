#!venv2_7/bin/python
#coding=utf-8

import click
import tornado.ioloop
import tornado.web
from redis import Redis

from handlers import *

@click.command()
@click.option("--host", default="0.0.0.0", help="server host")
@click.option("--port", default=12434, help="server port")
@click.option("--redis_addr", default="10.153.42.205:6379")
@click.version_option(version="0.0.1")
def main(host, port, redis_addr):
    redis_host_str, redis_port_str = redis_addr.strip().split(":")
    redis_obj = Redis(redis_host_str, int(redis_port_str), 0)
    redis_obj.get("a")
    settings = {
        "autoreload": True,
        "debug": True,
        "serv_traceback": True,
        "template_path": "templates/",
        "static_path": "static",
    }
    application = tornado.web.Application([
        (r"/delete/(.*)",   ProjectDeleteHandler,   dict(redis=redis_obj)),
        (r"/template/(.*)", TemplateHandler,        dict(redis=redis_obj)),
        (r"/",              IndexHandler,           dict(redis=redis_obj)),
        (r"/api/tplsave",   TemplateSaveHandler,    dict(redis=redis_obj)),
    ], **settings)
    application.listen(port, address=host)
    print "server[%s:%d] starting ... " % (host, port)
    tornado.ioloop.IOLoop.current().start()



if __name__ == "__main__":
    main()
