## **Error Handling in Go**

### **I. 概述**

在实际工程项目中，我们希望通过程序的错误信息快速定位问题，但是又不喜欢错误处理代码写的冗余而又啰嗦。Go语言没有提供像 Java、C# 语言中的 try...catch 异常处理方式，而是通过函数返回值逐层往上抛。这种设计，鼓励工程师在代码中**显式的检查错误**，而非忽略错误，好处就是避免漏掉本应处理的错误。但是带来一个弊端，让代码啰嗦。

### **II. Go标准包提供的错误处理功能**

1. error 是个 interface:
```go
type error interface {
    Error() string
}
```

2. 如何创建 error:
```go
// example 1
func Sqrt(f float64) (float64, error) {
    if f < 0 {
        return 0, errors.New("math: square root of negative number")
    }
    // implementation
}

// example 2
if f < 0 {
    return 0, fmt.Errorf("math: square root of negative number %g", f)
}
```

3. 如何自定义 error:
```go
// errorString is a trivial implementation of error.
type errorString struct {
    s string
}

func (e *errorString) Error() string {
    return e.s
}
```

4. 自定义 error 类型可以拥有一些**附加方法**。比如 net.Error 定义如下：
```go
package net

type Error interface {
    error
    Timeout() bool   // Is the error a timeout?
    Temporary() bool // Is the error temporary?
}
```

5. 网络客户端程序代码可以使用**类型断言**判断网络错误是**瞬时错误**还是**永久错误**。比如，一个网络爬虫可以在碰到瞬时错误的时候，等待一段时间然后重试。
```go
if nerr, ok := err.(net.Error); ok && nerr.Temporary() {
    time.Sleep(1e9)
    continue
}
if err != nil {
    log.Fatal(err)
}
```

6. 如何处理错误  

go标准包提供的错误处理方式虽然简单，但是在实际项目开发、运维过程中，会经常碰到如下问题：

- 函数该如何返回错误，是用**值**，还是用特殊的**错误类型**
- 如何检查被调用函数返回的错误，是**判断错误值**，还是用**类型断言**
- 程序中每层代码在碰到错误的时候，是**每层都处理**，还是只用在**最上层处理**，如何做到优雅
- 日志中的异常信息**不够完整**、缺少**stack strace**，不方便定位错误原因

### **III. Go语言中三种错误处理策略**

go语言中一般有三种错误处理策略

1. **返回和检查错误值**：通过**特定值**表示成功和不同的错误，上层代码检查**错误的值**，来判断被调用func的执行状态
2. **自定义错误类型**：通过自定义的**错误类型**来表示特定的错误，上层代码通过**类型断言**判断错误的类型
3. **隐藏内部细节的错误处理**：假设上层代码不知道被调用函数返回的错误任何细节，直接再向上返回错误

#### **1. 返回和检查错误值**

这种方式在其它语言中，也很常见。比如 **C Error Codes in Linux**

go标准库中提供一些例子：
- io.EOF
- syscall.ENOENT
- go/build.NoGoError
- path/filepath.SkipDir

这种策略是最不灵活的错误处理策略，上层代码需要判断返回错误值是否等于特定值。如果想修改返回的错误值，则会破坏上层调用代码的逻辑。
```go
buf := make([]byte, 100)
n, err := r.Read(buf)   // 如果修改 r.Read，在读到文件结尾时，返回另外一个 error，比如 io.END，而不是 io.EOF，则所有调用 r.Read 的代码都必须修改
buf = buf[:n]
if err == io.EOF {
    log.Fatal("read failed:", err)
}
```

另外一种场景也属于这类情况，上层代码通过检查错误的Error方法的返回值是否包含特定字符串，来判定如何进行错误处理。
```go
func readfile(path string) error {
    err := openfile(path)
    if err != nil {
        return fmt.Errorf("cannot open file: %v", err)
    }
    //...
}

func main() {
    err := readfile(".bashrc")
    if strings.Contains(error.Error(), "not found") {
        // handle error
    }
}
```

> error interface 的 Error 方法的输出，是给人看的，不是给机器看的。我们通常会把Error方法返回的字符串打印到日志中，或者显示在控制台上。永远不要通过**判断Error方法返回的字符串**是否包含特定字符串，来决定错误处理的方式。

“**高内聚、低耦合**”是衡量公共库质量的一个重要方面，而返回特定错误值的方式，增加了公共库和调用代码的**耦合性**。让模块之间产生了依赖。

#### **2. 自定义错误类型**

这种方式的典型用法如下：
```go
// 定义错误类型
type MyError struct {
    Msg string
    File string
    Line int
}

func (e *MyError) Error() string {
    return fmt.Sprintf("%s:%d: %s", e.File, e.Line, e.Msg)
}


// 被调用函数中
func doSomething() {
    // do something
    return &MyError{"Something happened", "server.go", 42}
}

// 调用代码中
err := doSomething()
if err, ok := err.(SomeType); ok {    // 使用 类型断言 获得错误详细信息
    //...
}
```

这种方式相比于“返回和检查错误值”，很大一个优点在于可以将 底层错误 包起来一起返回给上层，这样可以提供更多的**上下文信息**。比如os.PathError：
```go
// PathError records an error and the operation
// and file path that caused it.
type PathError struct {
    Op string
    Path string
    Err error
}

func (e *PathError) Error() string
```

然而，这种方式依然会增加模块之间的依赖。