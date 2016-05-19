#Plug.js

HTML templating tool for static sites. Load JSON files and have their values automagically added to your HTML.

##How to use

1. **Load your config files. You can have an unlimited number of these. Page will load slower the more you add 
though.**

`Plug.load("/path-to-my-file.json", "myNamespaceKeyword");`

2. **Write html like so. _This example assumes name is a value in the JSON as well as address._**

`<h1 plug="myNamespaceKeyword.name"></h1>
<p plug="myNamespaceKeyword.address.city"></p>`

3. **Call** `Plug.go();`


4. **It should just work after that!**
