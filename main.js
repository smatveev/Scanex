var canvas;
var ctx;
var originalPixels = null;
var currentPixels = null;
var picture = $("#picture");

function getImage()
{
	picture.attr("src", $('#imagenamePath').val()).appendTo('body');
}

function EnablePalette(){
	$("#palettePath").removeAttr("disabled");
	$("#btnSetPalette").removeAttr("disabled");
}

function xmlParse(xml) {
	var pallete = [];
    $(xml).find("ENTRY").each(function () {
		var Color = $(this).find("Color");
    	var code = $(this).find("Code").text();
    	pallete[code] = {};
    	pallete[code].R = Color.find("Part_Red").text();
    	pallete[code].G = Color.find("Part_Green").text();
    	pallete[code].B = Color.find("Part_Blue").text();
    	pallete[code].A = Color.find("Part_Density").text();
    });

	if(!originalPixels) return;
			
	for(var I = 0, L = originalPixels.data.length; I < L; I += 4) {
		if(originalPixels.data[I + 3] > 0) {
			if(pallete[originalPixels.data[I]]) {
				currentPixels.data[I] = pallete[originalPixels.data[I]].R; 
			 	currentPixels.data[I + 1] = pallete[originalPixels.data[I]].G; 
			 	currentPixels.data[I + 2] = pallete[originalPixels.data[I]].B; 
			 	currentPixels.data[I + 3] = pallete[originalPixels.data[I]].A;
			}
		}
	}
			
	 ctx.putImageData(currentPixels, 0, 0);
	 $("#pictureRes").attr("src", canvas.toDataURL("image/png"));
}

function getPallete()
{
	$.ajax({
		type: "GET",
		url: $("#palettePath").val(),
		dataType: "xml",
		error: function () {
			alert('Error loading XML document');
		},
		success: xmlParse
	});
}

function setPalette()
{
	var img = picture[0];
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = img.width;
	canvas.height = img.height;
			
	ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);

	originalPixels = ctx.getImageData(0, 0, img.width, img.height);
	currentPixels = ctx.getImageData(0, 0, img.width, img.height);		

	getPallete();
}
		