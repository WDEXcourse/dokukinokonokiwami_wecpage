var facefinder_classify_region = function(r, c, s, pixels, ldim) {return -1.0;};
var update_memory = pico.instantiate_detection_memory(5); 
var cascadeurl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
fetch(cascadeurl).then(function(response) {
	response.arrayBuffer().then(function(buffer) {
	var bytes = new Int8Array(buffer);
		facefinder_classify_region = pico.unpack_cascade(bytes);
		console.log('* cascade loaded');
	})
})


var ctx = document.getElementById('canvas').getContext('2d');
//var img = document.getElementById('image');
var msk_img = document.getElementById('mask');
//img.onload = () => ctx.drawImage(img, 0, 0);
var nrow = 480
var ncol = 640

function rgba_to_grayscale(rgba, nrows, ncols) {
    var gray = new Uint8Array(nrows*ncols);
    for(var r=0; r<nrows; ++r)
        for(var c=0; c<ncols; ++c)
            gray[r*ncols + c] = (2*rgba[r*4*ncols+4*c+0]+7*rgba[r*4*ncols+4*c+1]+1*rgba[r*4*ncols+4*c+2])/10;
    return gray;
}

var processfunc = function(video, dt) {
    ctx.drawImage(video, 0, 0);
    var rgba = ctx.getImageData(0, 0, ncol, nrow).data;
    image = {
        "pixels": rgba_to_grayscale(rgba, nrow, ncol),
        "nrows": nrow,
        "ncols": ncol,
        "ldim": ncol
    }
    params = {
        "shiftfactor": 0.1, 
        "minsize": 100,       
        "maxsize": 1000,     
        "scalefactor": 1.1 
    }

    dets = pico.run_cascade(image, facefinder_classify_region, params);
    dets = update_memory(dets);
    dets = pico.cluster_detections(dets, 0.2);
    qthresh = 50.0
  
    for(i=0; i<dets.length; ++i){
        if(dets[i][3]>qthresh)
        {
            ctx.beginPath();
            ctx.drawImage(msk_img, dets[i][1]-(dets[i][2]/2), dets[i][0]-(dets[i][2]/2), dets[i][2], dets[i][2])
        }
    }
}

var mycamvas = new camvas(ctx, processfunc);