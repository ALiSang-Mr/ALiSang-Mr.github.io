# List集合中取出最大值和最小值

获取最大值：**Collections.max()** 

``` java
       public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll) {
           Iterator<? extends T> i = coll.iterator();
           T candidate = i.next();
   
           while (i.hasNext()) {
               T next = i.next();
               if (next.compareTo(candidate) > 0)
                   candidate = next;
           }
           return candidate;
       }

```


获取最小值：**Collections.min()**

``` java
    public static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll) {
        Iterator<? extends T> i = coll.iterator();
        T candidate = i.next();

        while (i.hasNext()) {
            T next = i.next();
            if (next.compareTo(candidate) < 0)
                candidate = next;
        }
        return candidate;
    }

```