/**
 *  Description: display job info by selected user id, the UI is similar with index page
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'calendar.js');
        var win = Titanium.UI.currentWindow;
        var team_view_detail_page_obj = null;
        
        function team_view_detail_page(){
                var self = this;
                var window_source = 'team_view_detail_page';
                try{
                        win.title = win.display_name+'\'s Calendar';
                        //get parent class's properties
                        calendar_page.apply(this,arguments);
                        self.name = 'team_view_detail_page';
                }catch(err){
                        self.process_simple_error_message(err,window_source+' - team_view_detail_page');
                        return; 
                }
        }
                
        win.addEventListener('focus',function(){
                try{
                        if(team_view_detail_page_obj === null){
                                var P = function(){};
                                P.prototype = calendar_page.prototype;
                                team_view_detail_page.prototype = new P();
                                team_view_detail_page.prototype.constructor = team_view_detail_page;
                                team_view_detail_page_obj = new team_view_detail_page();
                                team_view_detail_page_obj.init();
                        }else{
                                if(Ti.App.Properties.getBool('refresh_list')){
                                        Ti.App.Properties.setBool('refresh_list',false);
                                        team_view_detail_page_obj.refresh(true);
                                }
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        team_view_detail_page_obj.close_window();
                        team_view_detail_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
