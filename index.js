var sql = require('mssql')
var _ = require('lodash')
var hat = require('hat')
var path = require('path')

var conn = "mssql://cafe4it_SQLLogin_1:rziqf3lvwu@thegioiquatran.mssql.somee.com/thegioiquatran"

var Importer = require('wxr')
var importer = new Importer()

sql.connect(conn).then(function () {
	new sql.Request().query("SELECT * from Mod_News where MenuId=1900").then(function (recordset) {
		recordset.forEach(function (record) {
			importer.addPost({
				id: record.ID,
				title: record.Name,
				name: record.Code,
				description: record.PageDescription,
				date: record.Published,
				status: 'publish',
				author: 'tranquangvinh',
				contentEncoded: record.Content,
				excerptEncoded: record.Summary,
				categories: [{
					title: "Tin tức",
					slug: "tin-tuc"
				}]
			});

			importer.addAttachment({
				title: record.Name,
				author: 'tranquangvinh',
				description: record.PageDescription,
				parent: record.ID,
				attachmentURL: record.File
			})
		});

		var xmlString = importer.stringify();
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