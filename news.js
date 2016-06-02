var sql = require('mssql')
var _ = require('lodash')
var hat = require('hat')
var path = require('path')
var builder = require('xmlbuilder')

var conn = "mssql://cafe4it_SQLLogin_1:rziqf3lvwu@thegioiquatran.mssql.somee.com/thegioiquatran"

var xml = builder.begin()
var channel = xml.ele('rss',{'xmlns:excerpt' : 'http://wordpress.org/export/1.2/excerpt/', 'xmlns:content' : 'http://purl.org/rss/1.0/modules/content/', 'xmlns:wfw' : 'http://wellformedweb.org/CommentAPI/', 'xmlns:dc' : 'http://purl.org/dc/elements/1.1/', 'xmlns:wp' : 'http://wordpress.org/export/1.2/', 'version' : '2.0'})
	.ele('channel')
channel.ele('wp:wxr_version','1.2');
sql.connect(conn).then(function () {
	new sql.Request().query("SELECT * from Mod_News where MenuId=1900").then(function (recordset) {
		recordset.forEach(function (record) {
			var item = channel.ele('item');
			item.ele('title', record.Name);
			item.ele('wp:post_name', record.Code)
			item.ele('wp:post_parent', 0)
			item.ele('description', record.PageDescription)
			item.ele('pubDate').dat(record.Published)
			item.ele('content:encoded').dat(record.Content)
			item.ele('excerpt:encoded').dat(record.Summary)
			item.ele('dc:creator').dat('tranquangvinh')
			item.ele('wp:post_type').dat('tin-tuc')
			item.ele('wp:publish').dat('publish')
			item.ele('category',{'domain' : 'danhmuc', 'nicename' : 'tin-tuc'}).dat('Tin tức')
		});
		var xmlString = xml.end();
		var exportFile = path.resolve('/tmp/', hat() + '.xml')
		require("fs").writeFile(exportFile, xmlString, function (err) {
			if (err) {
				console.log(err);
			}

			console.log("File was saved! Now it's time to import.")
		});
	}).catch(function (err) {
		console.error(err);
	})
})