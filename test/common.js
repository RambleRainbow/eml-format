var fs = require("fs");
var path = require("path");
var emlformat = require("../lib/eml-format.js");

exports["File extension"] = function(test) {
  var mimeType = "text/plain";
  var ext = emlformat.getFileExtension(mimeType);
  test.ok(ext == ".txt", "Expected .txt but got " + ext);
  test.done(); 
};

exports["Email address"] = function(test) {
  var email, data;
  
  email = "foo@bar.com";
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com");
  
  email = "<foo_12.36@bar.com>";
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo_12.36@bar.com");
  
  email = "Foo Bar <foo@bar.com>";
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.name == "string");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com", 'Expected "foo@bar.com" but got ' + data.email);
  test.ok(data.name == "Foo Bar", 'Expected "Foo Bar" but got ' + data.name);
  
  email = '"Foo Bar" <foo@bar.com>';
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.name == "string");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com", 'Expected "foo@bar.com" but got ' + data.email);
  test.ok(data.name == "Foo Bar", 'Expected "Foo Bar" but got ' + data.name);
  
  email = '=?UTF-8?Q?You=E2=80=99re=20Foo=20Bar?= <foo@bar.com>';
  data = emlformat.getEmailAddress(email);
  test.ok(typeof data == "object");
  test.ok(typeof data.name == "string");
  test.ok(typeof data.email == "string");
  test.ok(data.email == "foo@bar.com", 'Expected "foo@bar.com" but got ' + data.email);
  test.ok(data.name == "You’re Foo Bar", 'Expected "You’re Foo Bar" but got ' + data.name);
  
  test.done(); 
};

exports["Unquote"] = function(test) {
  var fixture, expected, actual;
  
  fixture = "=?UTF-8?Q?You=E2=80=99ve_added_a_card?=";
  expected = "You’ve_added_a_card";
  actual = emlformat.unquoteEncoding(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  fixture = "=?UTF-8?B?V2hhdOKAmXMgeW91ciBvbmxpbmUgc2hvcHBpbmcgc3R5bGU/?=";
  expected = "What’s your online shopping style?";
  actual = emlformat.unquoteEncoding(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');

  fixture = "=?GB2312?B?YWLV4srH1tDTos7EY2S77MXFZWY=?=";
  expected = "ab这是中英文cd混排ef"
  actual = emlformat.unquoteEncoding(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  test.done(); 
};

exports["Unquote printable"] = function(test) {
  var fixture, expected, actual;
  
  fixture = "You=E2=80=99ve added a card";
  expected = "You’ve added a card";
  actual = emlformat.unquotePrintable(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  fixture = "A line=0D=0A";
  expected = "A line\r\n";
  actual = emlformat.unquotePrintable(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  fixture = "Join line 1=\r\n=20with line 2=0D=0A";
  expected = "Join line 1 with line 2\r\n";
  actual = emlformat.unquotePrintable(fixture);
  test.ok(actual == expected, 'Expected "' + expected + '" but got "' + actual + '"');
  
  test.done(); 
};
