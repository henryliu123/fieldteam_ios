//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_map_page_obj = null;

        function job_edit_job_map_page(){
                var Map = require('ti.map');  
                var self = this;
                var window_source = 'base_job_address_page';
                win.title = self.ucfirst(win.type)+' Map';

                //public method
                /**
                 *  override ini  function of parent class: fieldteam.js
                 */                  
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.init_navigation_bar('','Main,Back');                                
                                _init_control();                                
                                _display();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };                   

                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _latitudeText='';
                var _longitudeText='';               
                var _address_for_map = '';

                //private mthod
                /**
                 *  init map view control and tomtom button
                 */
                function _init_control(){
                        try{
                                self.mapView = Map.createView({
                                        filter_class:'Map',
                                        type:'Map',
                                        mapType: Map.STANDARD_TYPE,
                                        animate:true,
                                        regionFit:true
                                });
                                win.add(self.mapView);

                                //tom tom button
                                self.tomtomButton = Ti.UI.createButton({
                                        backgroundImage:self.get_file_path('image','tomtom.png'),
                                        width:60,
                                        height:60,
                                        bottom:10+self.tool_bar_height,
                                        right:10,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        opacity:0.9
                                });
                                win.add(self.tomtomButton);

                                self.tomtomButton.addEventListener('click',function(){
                                        _event_for_tomtom_btn_click();
                                });                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_control');
                                return;
                        }
                }
                /** 
                 *  display map
                 */
                function _display(){
                        try{
                                self.display_indicator('Loading Data ...');
                                var state = '',
                                street_number='',
                                street = '',
                                suburb = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT a.*,(my_locality_state.state) as state FROM my_'+_type+' as a '+
                                        '  left join my_locality_state on (my_locality_state.id = a.locality_state_id) '+
                                        ' WHERE a.status_code=1 and a.company_id=? and a.id=?',_selected_company_id,_selected_job_id);
                                
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _latitudeText = rows.fieldByName('latitude');
                                        _longitudeText = rows.fieldByName('longitude');
                                        street_number = self.trim(rows.fieldByName('street_number'));
                                        street = self.trim(rows.fieldByName('street')+' '+rows.fieldByName('street_type'));
                                        suburb = self.trim(rows.fieldByName('suburb'));
                                        state = self.trim(rows.fieldByName('state'));
                                        _address_for_map = street_number+' '+street;
                                        if(self.trim(_address_for_map) == ''){
                                                _address_for_map = '';
                                        }
                                        if(suburb != ''){
                                                _address_for_map+=','+suburb;
                                        }
                                        if(state != ''){
                                                _address_for_map+=','+state;
                                        }
                                        _address_for_map = self.replace(_address_for_map,' ','+');
                                        _address_for_map = self.replace(_address_for_map,',',',+');
                                        Ti.API.info('_address_for_map:'+_address_for_map);
                                }
                                rows.close();
                                db.close();
                                //map
                                if((_latitudeText === '')||(_latitudeText === null)||(_longitudeText === '')||(_longitudeText === null)){
                                        if((street_number != null)&&(street != null)&&(suburb != '')&&(state != '')){
                                                Titanium.Geolocation.forwardGeocoder(street_number+' '+street+' '+suburb+' '+state,function(e){
                                                        if(e.error){
                                                        }else{
                                                                _latitudeText = e.latitude;
                                                                _longitudeText = e.longitude;
                                                                db = Titanium.Database.open(self.get_db_name());
                                                                db.execute('update my_'+_type+' set latitude=?,longitude=? where id=?',_latitudeText,_longitudeText,_selected_job_id);
                                                                db.close();
                                                                if(Ti.Network.online){
                                                                        var xhr = null;
                                                                        if(self.set_enable_keep_alive){
                                                                                xhr = Ti.Network.createHTTPClient({
                                                                                        enableKeepAlive:false
                                                                                });
                                                                        }else{
                                                                                xhr = Ti.Network.createHTTPClient();
                                                                        }
                                                                        xhr.onload = function(){
                                                                                try{
                                                                                        if((xhr.readyState == 4)&&(this.status == 200)){
                                                                                                if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                                                        return;
                                                                                                }                                                                                                
                                                                                                if(self.display_app_version_incompatiable(this.responseText)){
                                                                                                        return;
                                                                                                }                                                                                                   
                                                                                        }else{
                                                                                                self.hide_indicator(); 
                                                                                                var params = {
                                                                                                        message:'Update '+_type+' gps failed.',
                                                                                                        show_message:true,
                                                                                                        message_title:'',
                                                                                                        send_error_email:true,
                                                                                                        error_message:'',
                                                                                                        error_source:window_source+' - _display - xhr.onload - 1',
                                                                                                        server_response_message:this.responseText
                                                                                                };
                                                                                                self.processXYZ(params);                                                                                                
                                                                                                return;
                                                                                        }
                                                                                }catch(e){
                                                                                        self.hide_indicator();
                                                                                        params = {
                                                                                                message:'Update '+_type+' gps failed.',
                                                                                                show_message:true,
                                                                                                message_title:'',
                                                                                                send_error_email:true,
                                                                                                error_message:e,
                                                                                                error_source:window_source+' - _display - xhr.onload - 2',
                                                                                                server_response_message:this.responseText
                                                                                        };
                                                                                        self.processXYZ(params);  
                                                                                        return;
                                                                                }
                                                                        };
                                                                        xhr.onerror = function(e){
                                                                                self.hide_indicator();
                                                                                var params = {
                                                                                        message:'Update '+_type+' gps failed.',
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:e,
                                                                                        error_source:window_source+' - _display - xhr.onerror',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);                                                                                  
                                                                                return;
                                                                        };
                                                                        xhr.setTimeout(self.default_time_out);
                                                                        xhr.open('POST',self.get_host_url()+'update',true);
                                                                        xhr.send({
                                                                                'type':'update_job_gps_location',
                                                                                'hash':_selected_user_id,
                                                                                'job_id':_selected_job_id,
                                                                                'quote_id':_selected_job_id,
                                                                                'latitude':_latitudeText,
                                                                                'longitude':_longitudeText,
                                                                                'job_type':_type,
                                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                                'app_version_increment':self.version_increment,
                                                                                'app_version':self.version,
                                                                                'app_platform':self.get_platform_info()
                                                                        });
                                                                }
                                                        }
                                                });
                                        }
                                }
                                if((_latitudeText === '')||(_latitudeText === null)||(_longitudeText === '')||(_longitudeText === null)){
                                        var temp_country = Titanium.App.Properties.getString('selected_country_name');
                                        temp_country = (temp_country === null)?'':temp_country;     
                                        if(self.trim(temp_country) != ''){
                                                Titanium.Geolocation.forwardGeocoder(temp_country,function(e){
                                                        self.mapView.region = {
                                                                latitude:e.latitude,
                                                                longitude:e.longitude,
                                                                latitudeDelta:25, 
                                                                longitudeDelta:25
                                                        };
                                                });
                                        }
                                        self.tomtomButton.visible = false;
                                }else{
                                        self.mapView.region = {
                                                latitude:_latitudeText,
                                                longitude:_longitudeText,
                                                latitudeDelta:0.05, 
                                                longitudeDelta:0.05
                                        };
                                }

                                if((_latitudeText === '')||(_latitudeText === null)||(_longitudeText === '')||(_longitudeText === null)){
                                }else{
                                        var annotation = {
                                                title:suburb,
                                                subtitle:street_number+' '+street,
                                                latitude:_latitudeText,
                                                longitude:_longitudeText,
                                                animate:true
                                        };
                                        self.mapView.addAnnotation(annotation);
                                        self.tomtomButton.visible = true;
                                }
                                setTimeout(function(){
                                        self.hide_indicator();
                                },500);                                 
                        }catch(err){
                                setTimeout(function(){
                                        self.hide_indicator();
                                },500);                                 
                                self.process_simple_error_message(err,window_source+' - _display');
                                return;
                        }                                
                }
                /** 
                 *  click event for tomtom button
                 */
                function _event_for_tomtom_btn_click(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['Google Map','Tom Tom','Apple Map','Cancel','']:['Google Map','Tom Tom','Apple Map','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:3,
                                        title:'Please select option.'
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        switch(e.index){
                                                case 0:
                                                        var googleStr = (_address_for_map != '')?'comgooglemaps://?q='+_address_for_map+'&center='+_latitudeText+','+_longitudeText+'&zoom=12':'comgooglemaps://?center='+_latitudeText+','+_longitudeText+'&zoom=12';
                                                        if(Ti.Platform.canOpenURL(googleStr)){
                                                                Ti.Platform.openURL(googleStr);
                                                        }else{
                                                                self.show_message('The Google Map app is not installed.');
                                                        }                                                            
                                                        break;                                                    
                                                case 1:
                                                        if(Ti.Platform.canOpenURL('tomtomhome:geo:action=navigateto&lat='+_latitudeText+'&long='+_longitudeText)){
                                                                Ti.Platform.openURL('tomtomhome:geo:action=navigateto&lat='+_latitudeText+'&long='+_longitudeText);
                                                        }else{
                                                                self.show_message('The TomTom app is not installed.');
                                                        }                                                                                                                
                                                        break;                                                
                                                case 2:
                                                        if(Ti.Platform.canOpenURL('Maps://http://maps.google.com/maps?q='+_latitudeText+','+_longitudeText)){
                                                                Ti.Platform.openURL('Maps://http://maps.google.com/maps?q='+_latitudeText+','+_longitudeText);
                                                        }else{
                                                                self.show_message('The Google Map app is not installed.');
                                                        }    
                                                        break;                                                          
                                        }
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_tomtom_btn_click');
                                return;
                        }                                
                }        
        }
    
        win.addEventListener('open',function(){
                try{
                        if(job_edit_job_map_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_map_page.prototype = new F();
                                job_edit_job_map_page.prototype.constructor = job_edit_job_map_page;
                                job_edit_job_map_page_obj = new job_edit_job_map_page();
                                job_edit_job_map_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_map_page_obj.close_window();
                        job_edit_job_map_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


