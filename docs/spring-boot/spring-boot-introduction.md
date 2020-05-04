### SpringBoot™

---

- 官网：https://spring.io/

- 任何形式的服务架构演进都是以网络通信（吞吐）不再是瓶颈为前提的

#### Spring 优点

1. 编码阶段：
   1. 去除XML，“一切配置皆对象”，Java 编码的方式写配置
   2. 简化构建配置，自动配置
2. 运行阶段：
   1. jar 包：独立可执行， java -jar 即可启动后作为独立的进程提供服务
   2. jar 包：独立的 jar 包更容易被纳入各种容器，易于大规模和随时（容错自恢复）（云端）部署

#### Spring 核心

1. 自动配置：auto configuration  
   - spring-boot-autoconfiguration
   - @EnableAutoConfiguration
     - AutoConfigurationImportSelector
     - META_INF/spring.factoroes
   - 条件注解：@Conditonal 系列注解
2. 起步依赖：starter dependency
3. 命令行界面：spring boot cli
4. Actuator：生产级特效

