package com.luv2code.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyAppConfig implements WebMvcConfigurer {
    // This class can be used to configure additional settings for the application
    // such as view resolvers, message converters, etc.
    // Currently, it does not contain any specific configurations.

    @Value("${allowed.origins}")
    private String theAllowedOrigins;

    @Value("${spring.data.rest.base-path}")
    private String basePath;

    @Override
    public void addCorsMappings(CorsRegistry cors) {
        //set CORS mapping for the application
        cors.addMapping(basePath + "/**")
            .allowedOrigins(theAllowedOrigins);
    }
}
