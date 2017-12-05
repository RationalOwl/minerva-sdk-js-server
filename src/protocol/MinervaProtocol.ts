
export class MinervaProtocol {
    /* CS components types */
    // app server type (1 ~ 99)   
    public static SERVER_TYPE_JAVA = 1;
    public static SERVER_TYPE_CSHART = 2;
    public static SERVER_TYPE_CPP = 3;
    public static SERVER_TYPE_JAVASCRIPT = 4;
    public static SERVER_TYPE_PHP = 5;
    public static SERVER_TYPE_PYTHON = 6;
    public static SERVER_TYPE_REST = 99;


    ////////////////////////////////////////////////
    //event
    ////////////////////////////////////////////////        
    public static EVENT_GRP_ID = 0;

    //device send keep alive event to the push server 
    public static EVT_HEARTBEAT_SERVER_CMD_ID = 2;



    ////////////////////////////////////////////////
    //CS(Customer Service) 
    ////////////////////////////////////////////////                    
    public static CS_GRP_ID = 300;

    /* CS(Customer Service) server registration related constants */
    public static CS_SERVER_REG_CMD_ID = 301;
    public static CS_SERVER_UNREG_CMD_ID = 302;


    ////////////////////////////////////////////////
    //Device group
    ////////////////////////////////////////////////              

    public static DEVICE_GRP_ID = 800;

    //create device group
    public static DEVICE_GRP_CREATE_CMD_ID = 801;
    public static DEVICE_GRP_ADD_CMD_ID = 802;
    public static DEVICE_GRP_SUBTRACT_CMD_ID = 803;
    public static DEVICE_GRP_DELETE_CMD_ID = 804;

    // async result
    public static ASYNC_RES_DEVICE_GRP_CREATE_CMD_ID = 11801;
    public static ASYNC_RES_DEVICE_GRP_ADD_CMD_ID = 11802;
    public static ASYNC_RES_DEVICE_GRP_SUBTRACT_CMD_ID = 11803;
    public static ASYNC_RES_DEVICE_GRP_DELETE_CMD_ID = 11804;

    ////////////////////////////////////////////////
    //channel
    ////////////////////////////////////////////////              
    /* send message related constants */
    public static CHANNEL_GRP_ID = 400;

    //server channel
    public static CH_SETUP_SERVER_CHANNEL_CMD_ID = 403;


    ////////////////////////////////////////////////
    //message
    ////////////////////////////////////////////////              
    /* send message related constants */
    public static MSG_GRP_ID = 500;

    /* down stream message */
    //send message from app server to push server
    public static MSG_SEND_UNICAST_CMD_ID = 501;
    //send message from app server to push server
    public static MSG_SEND_MULTICAST_CMD_ID = 502;
    public static MSG_SEND_BROADCAST_CMD_ID = 503;

    //send message from push server to device
    public static MSG_DELIVER_CMD_ID = 504;

    /* upstream message */

    //send message from push server to device
    public static MSG_DELIVER_UPSTREAM_CMD_ID = 512;


    /* group message */
    //send message from app server to messaging server   
    public static MSG_SEND_GROUP_CMD_ID = 561;

    //support msg queuing
    public static MSG_Q_NOT_SUPPORT = 0;
    public static MSG_Q_SUPPORT = 1;

}
