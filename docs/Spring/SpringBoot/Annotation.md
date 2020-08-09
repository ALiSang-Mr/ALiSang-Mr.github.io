# SpringBoot-常用注解

Spring boot中常用的注解，及其在项目开发中实际使用位置和示例

注解|使用位置|作用|
---|:--:|---:|
@Controller|类名上方|声明此类是一个SpringMVC Controller对象|
@RequestMapping|类或方法上|用在类上，表示所有响应请求的方法都是以该地址作为父路径|
@RequestBody|方法上|将Controller的方法返回的对象，通过适当的HttpMessageConverter转换为指定格式(Json/xml)后，写入到Response对象的body数据区。|
@RestController|类名上|可代替@ResponseBody和@Controller合在一起的作用。但不能返回Jsp和HTML页面了|
@RequestBody|方法参数前|常用来处理Content-type:application/json,application/xml等，意味着HTTP消息是JSON,需转化为指定类|
@Service|类名上|声明是一个业务处理类(实现类非接口类)|
@Repository|类名上|声明是一个数据库或其他NOSql访问类(实现类非接口类)|
@Component|类名上|声明此类是Spring管理类，常用在无法用@Service、@Repository描述的Spring管理类上，相当用通用的注解|
@Configuration|类名上|声明此类是一个配置类，常与@Bean配合使用|
@Bean|方法名上|声明该方法返回结果是一个Spring容器管理的Bean，包含@PostConstruct和@PreDestroy|
@Qualifier|类名或属性上|为Bean指定名称，随后再通过名字应用Bean|
@Autowired|属性或构造函数参数上|按byType自动注入|
@Resource|类名上|默认按byName自动注入|
@Value|实行上|用于获取配置文件中的值|
@@PathVariable|方法参数前|将URL获取参数，映射到方法参数上|
