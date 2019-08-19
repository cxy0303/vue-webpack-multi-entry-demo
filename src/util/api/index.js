import apihelper from './apihelper'

var apilist = {
  getadlist: function(params) {
    var p = {
      cityId: 310100,
      cityName: "上海市",
      lat: 31.24916171,
      lng: 121.48789949,
      pageNo: 1,
      pageSize: 10,
      ...params
    }
    return apihelper.post("/buildingGroup/index", p);
  }
}

export default apilist;
