var app_page = function() {        
        if(Titanium.Platform.name == 'android') { 
                Titanium.include('app_android.js');
        }else{
                Titanium.include('app_iphone.js');
        }       
}();
