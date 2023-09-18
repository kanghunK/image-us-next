export class AuthRequiredError extends Error {
    constructor(message = "페이지에 접속할 권한이 없습니다.") {
        super(message);
        this.name = "AuthRequiredError";
    }
}

export class NetworkError extends Error {
    constructor(message = "연결되 네트워크가 없습니다.") {
        super(message);
        this.name = "NetworkError";
    }
}

export class ServerError extends Error {
    constructor(message = "서버 문제로 잠시 후에 다시 시도 해주세요.") {
        super(message);
        this.name = "ServerError";
    }
}

export class unknownError extends Error {
    constructor(
        message = "예기치 못한 에러가 발생하였습니다..다시 시도해주세요."
    ) {
        super(message);
        this.name = "unknownError";
    }
}

export class alertErrorMessage extends Error {
    constructor(message = "") {
        super(message);
        this.name = "alertErrorMessage";
    }
}
