import Koa from 'koa';
import KoaBody from 'koa-body';
import Morgan from 'morgan';
import BodyParser from 'body-parser';
import Router from "koa-router";
import cors from "@koa/cors";
import {EthereumUtil} from "./classes/EthereumUtil";
import {EthereumRouter} from "./routes/ethereum_router";
import morgan from "morgan";
import bodyParser from "body-parser";


class ServerApp {

    private app: Koa;
    private router: Router;
    readonly route_port = 3000;
    private ethereumUtils?: EthereumUtil;

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

        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());

        this.initRouteControllers();
        this.KoaInit();
    }


    private KoaInit(): void {

        this.app.use(async () => {
            morgan("dev");
            bodyParser.urlencoded({extended:true});
            bodyParser.json()
        });

        this.app.use(async () => {
            Morgan("dev");
            BodyParser.urlencoded({extended:true});
            BodyParser.json()
        });

        this.app.listen(this.route_port, () => {console.log(`http://localhost:${this.route_port}`)});
    }

    private initRouteControllers(): void {
        new EthereumRouter(this.app, this.router);
    }
}

new ServerApp();
