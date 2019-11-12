# List集合中相同属性的对象合并

**描述：**
  将List集合中相同属性的对象的值进行合并操作。
  

``` java
    public class Person {
        private Integer key;
        private Integer value;
        //书写get、set方法
        public Integer getKey(){
            return key;
        }
        public void setKey(Integer key){
            this.key = key;
        }
        public Integer getValue(){
            return value;
        }
        public void setValue(Integer value){
            this.value = value;
        }
    }
```

``` java
public class UsePerson {

    public static void main(String []args){
        List<Person> personList = new ArrayList<Person>();
        Person p1 = new Person();
        //为Integer类型可直接输入数字
        p1.setKey(1);
        p1.setValue(2);
        Person p2 = new Person();
        p2.setKey(2);
        p2.setValue(1);
        Person p3 = new Person();
        p3.setKey(1);
        p3.setValue(3);
        Person p4 = new Person();
        p4.setKey(2);
        p4.setValue(4);
        personList.add(p1);
        personList.add(p2);
        personList.add(p3);
        personList.add(p4);
        //去除重复key，并且合并value
        List<Person> newPersonList = getNewList(personList);
        //输出去除重复的key，并输出value
        for(Person person : newPersonList){
            System.err.println("key："+ person.getKey());
            System.out.println("value："+ person.getValue());
        }
    }


    public static List<Person> getNewList(List<Person> oldList){
        HashMap<Integer,Person> tempMap = new HashMap<Integer,Person>();
        //去掉重复的key
        for(Person person : oldList){
            int temp = person.getKey();
            //containsKey(Object key)该方法判断Map集合中是否包含指定的键名，如果包含返回true，不包含返回false
            //containsValue(Object value)该方法判断Map集合中是否包含指定的键值，如果包含返回true，不包含返回false
            if(tempMap.containsKey(temp)){
                Person newPerson = new Person();
                newPerson.setKey(temp);
                //合并相同key的value
                newPerson.setValue(tempMap.get(temp).getValue() + person.getValue());
                //HashMap不允许key重复，当有key重复时，前面key对应的value值会被覆盖
                tempMap.put(temp,newPerson );
            }else{
                tempMap.put(temp,person );
            }
        }
        //去除重复key的list
        List<Person> newList = new ArrayList<Person>();
        for(Integer temp:tempMap.keySet()){
            newList.add(tempMap.get(temp));
        }
        return newList;
    }
}
```

 这里将map作为临时转换容器,并且使用map的containsKey()方法进行过滤判断。
 
> containsKey(Object key)该方法判断Map集合中是否包含指定的键名，如果包含返回true，不包含返回false

> containsValue(Object value)该方法判断Map集合中是否包含指定的键值，如果包含返回true，不包含返回false
 

 
 