const Mock = require("mockjs");

Mock.mock("/api/login", (req, res) => {
    console.log("🥖 ~ file: mock.js ~ line 4 ~ Mock.mock ~ req, res", req, res);

    return Mock.mock({
        name: "admin",
        password: "123456",
        token: "20191129592",
    });
});

Mock.mock("/userInfo", (req, res) => {
    console.log("🥖 ~ file: mock.js ~ line 4 ~ Mock.mock ~ req, res", req, res);
    req.body = JSON.parse(req.body);
    if (req.body.token == "123") {
        //模拟token验证
        return Mock.mock({
            code: 200,
            data: {
                name: "admin",
                password: "123456",
                role: ["admin"],
            },
        });
    }
});