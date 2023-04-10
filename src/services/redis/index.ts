import RedisUserService from "./user";
import RedisEggsService from "./eggs";
import RedisMonsterService from "./monster";

import { applyMixins } from "../../utils/mixins";

class RedisService  { 
    public user: RedisUserService;
    public eggs: RedisEggsService;
    public monster: RedisMonsterService;

    constructor() {
        this.user = new RedisUserService();
        this.eggs = new RedisEggsService();
        this.monster = new RedisMonsterService();
    }
 }


export default RedisService;