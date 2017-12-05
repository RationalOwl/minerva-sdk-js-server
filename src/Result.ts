

export class Result {

    public static RESULT_OK = 1;
    public static RESULT_UNKNOWN_ERROR = -1;

    /* CS(customer service) related */
    // server registration related code
    public static RESULT_SERVER_NOT_YET_REGISTERED = -101;
    public static RESULT_SERVER_REGNAME_ALREADY_REGISTERED = -102;
    public static RESULT_OTHER_SERVER_ALREADY_REGISTERED = -103;
    public static RESULT_SERVER_ID_NOT_MATCH = -104;

    // channel related code
    public static RESULT_CHANNEL_ALREADY_CONNECTED = -301;
    public static RESULT_CHANNEL_IS_NOT_AVAILABLE = -302;
    public static RESULT_NETWORK_IS_NOT_AVAILABLE = -303;
    public static RESULT_INVALID_ARGUMENT = -304;

    // result messages
    public static RESULT_OK_MSG = "작업이  성공 했습니다.";
    public static RESULT_UNKNOWN_ERROR_MSG = "알 수 없는 에러입니다.";

    public static RESULT_SERVER_NOT_YET_REGISTERED_MSG = "App 서버가 아직 등록되지 않았습니다.";
    public static RESULT_SERVER_REGNAME_ALREADY_REGISTERED_MSG = "이미 동일한 서버 등록 이름이  동일 서비스내에 존재합니다.";
    public static RESULT_OTHER_SERVER_ALREADY_REGISTERED_MSG = "이미 다른 App 서버가 등록되었습니다";
    public static RESULT_SERVER_ID_NOT_MATCH_MSG = "서버 등록ID가 잘못되었습니다.";

    public static RESULT_CHANNEL_ALREADY_CONNECTED_MSG = "채널이 이미 연결되어 있습니다.";
    public static RESULT_CHANNEL_IS_NOT_AVAILABLE_MSG = "채널이 가용하지 않은 상태입니다.";

    public static RESULT_NETWORK_IS_NOT_AVAILABLE_MSG = "네트워크 연결이 끊어져 있습니다.";
    public static RESULT_INVALID_ARGUMENT_MSG = "전달 인자가 잘못되엇습니다.";

    public static getResultMessage(resultCode: number): string {
        switch (resultCode) {
            case Result.RESULT_OK:
                return Result.RESULT_OK_MSG;
            case Result.RESULT_UNKNOWN_ERROR:
                return Result.RESULT_UNKNOWN_ERROR_MSG;
            case Result.RESULT_SERVER_NOT_YET_REGISTERED:
                return Result.RESULT_SERVER_NOT_YET_REGISTERED_MSG;
            case Result.RESULT_SERVER_REGNAME_ALREADY_REGISTERED:
                return Result.RESULT_SERVER_REGNAME_ALREADY_REGISTERED_MSG;
            case Result.RESULT_OTHER_SERVER_ALREADY_REGISTERED:
                return Result.RESULT_OTHER_SERVER_ALREADY_REGISTERED_MSG;
            case Result.RESULT_SERVER_ID_NOT_MATCH:
                return Result.RESULT_SERVER_ID_NOT_MATCH_MSG;
            case Result.RESULT_CHANNEL_ALREADY_CONNECTED:
                return Result.RESULT_CHANNEL_ALREADY_CONNECTED_MSG;
            case Result.RESULT_CHANNEL_IS_NOT_AVAILABLE:
                return Result.RESULT_CHANNEL_IS_NOT_AVAILABLE_MSG;
            case Result.RESULT_NETWORK_IS_NOT_AVAILABLE:
                return Result.RESULT_NETWORK_IS_NOT_AVAILABLE_MSG;
            case Result.RESULT_INVALID_ARGUMENT:
                return Result.RESULT_INVALID_ARGUMENT_MSG;
            default:
                return Result.RESULT_UNKNOWN_ERROR_MSG;
        }
    }
}