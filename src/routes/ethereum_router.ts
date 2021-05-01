import Koa from "koa";
import Router from "koa-router";
import {EthereumUtil} from "../classes/EthereumUtil";

export class EthereumRouter {

    private server: Koa;
    private router: Router;
    private ethereum_util?: EthereumUtil;
    private ganachePort: number;

    constructor(server: Koa, app_router: Router) {
        this.server = server;
        this.router = app_router;
        this.ganachePort = 7545;

        this.router.get('/ethereumRouter', (ctx, next) => {
            // ctx.router available
            ctx.body = 'Hello Ethereum Router!';
        });

        this.initRoutes();
    }

    private initRoutes() {

        this.connectGanache();
        this.getAddrDetails();

        this.server
            .use(this.router.routes())
            .use(this.router.allowedMethods());
    }

    private connectGanache(): void {

        this.router.post('/connectToGanache', async (ctx, next) => {

            try {
                if (ctx.request.body.port) {

                    this.ganachePort = ctx.request.body.port;

                    this.ethereum_util = new EthereumUtil(this.ganachePort);

                    ctx.body = `Connected to Ganache in port:${this.ganachePort}`;
                    ctx.status = 200;

                } else {
                    ctx.throw(400, '[ERROR] In request body of /connectToGanache');
                }

            } catch (e) {
                ctx.throw(500, '[ERROR] connecting to Ganache');
            }
        });
    }

    private getAddrDetails(): void {

        this.router.post('/addressDetails', async (ctx, next) => {

            try {

                if (ctx.request.body.addr) {
                    const addr: string = ctx.request.body.addr;

                    if (this.ethereum_util) {
                        ctx.body = await this.ethereum_util.getAddrDetails(addr);
                    } else {
                        this.ethereum_util = new EthereumUtil(this.ganachePort);

                        ctx.body = await this.ethereum_util.getAddrDetails(addr);
                    }

                    ctx.status = 200;

                } else {
                    ctx.throw(400, `[ERROR] In request body of /addressDetails`);
                }

            } catch (e) {
                ctx.throw(500, `${e}`)
            }
        });
    }
}
