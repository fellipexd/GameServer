import RedisUserService from "./user";
import RedisEggsService from "./eggs";
import { applyMixins } from "../../utils/mixins";

class RedisService  { 
    public user: RedisUserService;
    public eggs: RedisEggsService;
    constructor() {
        this.user = new RedisUserService();
        this.eggs = new RedisEggsService()
    }
 }


export default RedisService;