export default {
    auth: {
        domain: "dev-unktrv06ka6he3fg.eu.auth0.com",
        clientId: "QfRB6XUsuuzpeeUrLZudByv8oj4dX4MN",
        authorizationParams: {
            redirect_uri: "http://localhost:4200/login/callback",
            audience: "http://localhost:8080",
        },
    },
    httpInterceptor: {
        allowedList: [
            'http://localhost:8080/api/orders/**',
            'http://localhost:8080/api/checkout/purchase'
        ],
    },
}
