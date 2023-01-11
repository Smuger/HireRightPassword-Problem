# Passwords containing %

### HireRight uses /^[^%\s]{8,}/ for checking their password length rule *isValidLength()*

---




#### Which means that

| Accept      | Deny        |
| ----------- | ----------- |
| 12345678    | %2345678    |
| qwertyui    | 123%5678    |




### Code

```javascript
function isValidLength(input) {
	var reg = /^[^%\s]{8,}/;
    return reg.test(input);
}
```