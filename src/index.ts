import Koa from 'koa';
import KoaBody from 'koa-body';
import Morgan from 'morgan';
import BodyParser from 'body-parser';
import Router from "koa-router";
import cors from "@koa/cors";


class ServerApp {

    private app: Koa;
    private router: Router;
    readonly route_port = 3000;

    constructor() {
        this.app = new Koa();
        this.app.use(cors());
        this.app.use(KoaBody());
        this.router = new Router();

        this.router.get('base route', '/',async (ctx) => {
            // ctx.router available
            ctx.body = 'Hello World through Koa!';
            ctx.status = 200;
        });

        this.KoaInit();
    }


    private KoaInit(): void {

        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());

        this.app.use(async () => {
            Morgan("dev");
            BodyParser.urlencoded({extended:true});
            BodyParser.json()
        });

        this.app.listen(this.route_port, () => {console.log(`http://localhost:${this.route_port}`)});
    }
}

new ServerApp();
