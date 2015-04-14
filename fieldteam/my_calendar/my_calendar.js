/*
 * This class is the parent class of my calendar and teamview
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'calendar.js');
        var win = Titanium.UI.currentWindow;
        var my_calendar_page_obj = null;

        function my_calendar_page(){
                var self = this;
                var window_source = 'my_calendar_page';
                try{
                        calendar_page.apply(this,arguments);
                        //public member
                        self.name = 'my_calendar_page';   
                }catch(err){
                        self.process_simple_error_message(err,window_source+' - my_calendar_page');
                        return; 
                }
        }       

        win.addEventListener('focus',function(){
                try{                    
                        if(my_calendar_page_obj === null){                                
                                var P = function(){};
                                P.prototype = calendar_page.prototype;
                                my_calendar_page.prototype = new P();
                                my_calendar_page.prototype.constructor = my_calendar_page;
                                my_calendar_page_obj = new my_calendar_page();
                                my_calendar_page_obj.init();
                        }else{
                                if(Ti.App.Properties.getBool('refresh_list')){
                                        Ti.App.Properties.setBool('refresh_list',false);
                                        my_calendar_page_obj.refresh(true);
                                }
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{         
                        my_calendar_page_obj.close_window();
                        my_calendar_page_obj = null;
                        win = null;          
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
