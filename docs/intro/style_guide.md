---
title: 文档撰写格式指南
---

我们可以使用 [GitHub-flavored Markdown syntax](https://github.github.com/gfm/) 进行编辑。

## Markdown 语法

## Headers

```md
# H1 - 1 级标题

## H2 - 2 级标题

### H3 - 3 级标题

#### H4 - 4 级标题

##### H5 - 5 级标题

###### H6 - 6 级标题
```

# H1 - 1 级标题

## H2 - 2 级标题

### H3 - 3 级标题

#### H4 - 4 级标题

##### H5 - 5 级标题

###### H6 - 6 级标题

我们默认一级标题为单页面的标题。如无必要，请使用二至三级标题。

---

## 强调

```md
斜体，使用 _星号_ 或 _下划线_

粗体，使用 **两个星号** 或 **两个下划线**

结合使用 **星号和 _下划线_**

删除线，使用 ~~双波浪线~~
```

斜体，使用 _星号_ 或 _下划线_

粗体，使用 **两个星号** 或 **两个下划线**

结合使用 **星号和 _下划线_**

删除线，使用 ~~双波浪线~~

---

## 列表

<!-- prettier-ignore-start -->

```md
1. 有序列表第一项
2. 第二项
   - 无序子列表
1. 数字是多少并不重要
   1. 有序子列表
4. 但是建议按照数字进行排序

* 无序列表可以使用星号 `*`

- 或减号 `-`

+ 或加号 `+`
```

1. 有序列表第一项
2. 第二项
   - 无序子列表
1. 数字是多少并不重要
   1. 有序子列表
4. 但是建议按照数字进行排序

* 无序列表可以使用星号 `*`

- 或减号 `-`

+ 或加号 `+`

<!-- prettier-ignore-end -->

---

## 链接

```md
[行内链接](https://www.eesast.com/)

[含标题行内链接](https://www.eesast.com/ "EESΛST Homepage")

[可以修改链接 url 为特殊文字][任意文字]

[也可以使用数字标号][1]

或者留空链接并使用 [链接文字本身]

`<` 和 `>` 之间的链接会自动转为链接。https://www.eesast.com/ 或 <https://www.eesast.com/>

[任意文字]: https://www.eesast.com/
[1]: https://www.eesast.com/
[链接文字本身]: https://www.eesast.com/
```

[行内链接](https://www.eesast.com/)

[含标题行内链接](https://www.eesast.com/ "EESΛST Homepage")

[可以修改链接 url 为特殊文字][任意文字]

[也可以使用数字标号][1]

或者留空链接并使用 [链接文字本身]

`<` 和 `>` 之间的链接会自动转为链接。https://www.eesast.com/ 或 <https://www.eesast.com/>

[任意文字]: https://www.eesast.com/
[1]: https://www.eesast.com/
[链接文字本身]: https://www.eesast.com/

---

## 图片

```md
行间插入图片： ![说明文字](../../static/img/favicon.ico "图标说明文字1")

引用式插入图片： ![说明文字][logo]

[logo]: ../../static/img/favicon.ico "图标说明文字2"

使用相对路径导入图片

![img](../../static/img/favicon.ico)
```

行间插入图片： ![说明文字](../../static/img/favicon.ico "图标说明文字1")

引用式插入图片： ![说明文字][logo]

[logo]: ../../static/img/favicon.ico "图标说明文字2"

使用相对路径导入图片

![img](../../static/img/favicon.ico)

---

## 代码

````md
    ```javascript
    var s = 'JavaScript syntax highlighting';
    alert(s);
    ```

    ```python
    s = "Python syntax highlighting"
    print(s)
    ```

    ```
    No language indicated, so no syntax highlighting.
    But let's throw in a <b>tag</b>.
    ```

    ```js {2}
    function highlightMe() {
    console.log('This line can be highlighted!');
    }
    ```
````

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print(s)
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

```js {2}
function highlightMe() {
  console.log("This line can be highlighted!");
}
```

---

## 表格

冒号 `:` 用于指定对齐方式

```md
| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |
```

| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | `renders` | **nicely** |
| 1        | 2         | 3          |

---

## 引用

```md
> 引用可以用于转述他人所言

> 非常长的语句也可以很好地被引用括起来，此外也可以在引用中使用**Markdown**语法
```

> 引用可以用于转述他人所言

> 非常长的语句也可以很好地被引用括起来，此外也可以在引用中使用**Markdown**语法

---

## HTML

```html
<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>
```

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>

---

## 换行

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a _separate paragraph_.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the _same paragraph_.

---

## Admonitions

```md
:::note

This is a note

:::

:::tip

This is a tip

:::

:::important

This is important

:::

:::caution

This is a caution

:::

:::warning

This is a warning

:::
```

:::note

This is a note

:::

:::tip

This is a tip

:::

:::important

This is important

:::

:::caution

This is a caution

:::

:::warning

This is a warning

:::
