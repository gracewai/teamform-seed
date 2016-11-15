describe('test index.js', function(){
  beforeEach(function(){
    var body = document.getElementsByTagName("body")[0];
    var button = document.createElement("div");
    button.setAttribute("id", "btn_admin");
    body.appendChild(button);

    button = document.createElement("div");
    button.setAttribute("id", "btn_leader");
    body.appendChild(button);

    button = document.createElement("div");
    button.setAttribute("id", "btn_member");
    body.appendChild(button);

  });
  
  it('test admin button',function(){
    onReady();
    admin_click('check');
    expect(url_check).toEqual('admin.html?q=check');
  });


  it('test team button',function(){
    onReady();
    team_click('check');
    expect(url_check).toEqual('team.html?q=check');
  });

  it('test member button',function(){
    onReady();
    member_click('check');
    expect(url_check).toEqual('member.html?q=check');
  });

});
