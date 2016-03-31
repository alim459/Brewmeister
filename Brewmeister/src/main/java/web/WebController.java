package web;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebController {

    @RequestMapping(value = "/beers", method = RequestMethod.GET)
    public
    @ResponseBody
    ArrayList<BeerInfo> searchBeers (@RequestParam(value="bname", required = false) String bname,
                                     @RequestParam(value="type", required = false) String btype,
                                     @RequestParam(value="vendor", required = false) String vendor,
                                     @RequestParam(value="ibu", required = false) String ibu,
                                     @RequestParam(value="abv", required = false) String abv,
                                     @RequestParam(value="rating", required = false) String rating,
//                                     @RequestParam(value="description", required = false) String description,
                                     @RequestParam(value="breweryname", required = false) String breweryName,
                                     HttpServletResponse httpResponse) throws IOException {

        Map<String,String> searchBeerMap = new HashMap<>();

        searchBeerMap.put("bname", bname);
        searchBeerMap.put("type", btype);
        searchBeerMap.put("ibu", ibu);
        searchBeerMap.put("abv", abv);
        searchBeerMap.put("averageRating", rating);
//        searchBeerMap.put("Description", description);
        searchBeerMap.put("breweryName", breweryName);

        AccessDatabase accessDB = new AccessDatabase();
        ArrayList<BeerInfo> beers;
        try {
            beers = accessDB.searchBeers(searchBeerMap);
        } catch (Exception e) {
            beers = null;
        }

        httpResponse.setStatus(HttpServletResponse.SC_OK);

        return beers;
    }

    @RequestMapping(value = "/recommendedbeers", method = RequestMethod.GET)
    public
    @ResponseBody
    ArrayList<BeerInfo> recs (
            @RequestParam(value="userid", required = false) String userid,
            HttpServletResponse httpResponse) throws IOException {
        AccessDatabase accessDB = new AccessDatabase();
        ArrayList<BeerInfo> beers;
        try {
            beers = accessDB.getRecommendations(Integer.parseInt(userid));
            httpResponse.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            beers = null;
            httpResponse.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return beers;
    }

    @RequestMapping(value = "/reviews", method = RequestMethod.GET)
    public
    @ResponseBody
    ArrayList<BeerInfo> revs (
            @RequestParam(value="userid", required = false) String userid,
            @RequestParam(value="bname", required = false) String bname,
            HttpServletResponse httpResponse) throws IOException {
        AccessDatabase accessDB = new AccessDatabase();
        ArrayList<BeerInfo> reviews;

        //TODO: ADD FUNCTIONALITY

//        try {
//            if(userid==null){
//                //TODO search reviews by beer name
//            }
//            else{
//                //TODO search reviews by a user
//            }
//            httpResponse.setStatus(HttpServletResponse.SC_OK);
//        } catch (Exception e) {
//            reviews = null;
//            httpResponse.setStatus(HttpServletResponse.SC_NOT_FOUND);
//        }
        return new ArrayList<BeerInfo>();
    }

    // Get vendors by beer name
    @RequestMapping(value = "/vendors", method = RequestMethod.GET)
    public
    @ResponseBody
    ArrayList<BeerInfo> vendors (
            @RequestParam(value="bname", required = false) String bname,
            HttpServletResponse httpResponse) throws IOException {
        AccessDatabase accessDB = new AccessDatabase();
        ArrayList<BeerInfo> reviews;

        //TODO: ADD FUNCTIONALITY FOR GETTING VENDORS THAT SELL A BEER

//        try {
//            httpResponse.setStatus(HttpServletResponse.SC_OK);
//        } catch (Exception e) {
//            reviews = null;
//            httpResponse.setStatus(HttpServletResponse.SC_NOT_FOUND);
//        }
        return new ArrayList<BeerInfo>();
    }


//    POST REQUESTS
//++++++++++++++++++++++++++++++++++
    @RequestMapping(value = "/beers", method = RequestMethod.POST)
    public @ResponseBody JSONObject updateBeer(@RequestBody String body) throws JSONException {
        JSONObject bodyJSON = new JSONObject(body);
        String bname = bodyJSON.getString("bname");
        String breweryName = bodyJSON.getString("breweryName");
        String type = bodyJSON.getString("type");
        Double abv = bodyJSON.getDouble("abv");
        Double ibu = bodyJSON.getDouble("ibu");
        String description = bodyJSON.getString("description");
        Boolean brewed = bodyJSON.getBoolean("brewed");

        BeerInfo newBI = new BeerInfo(bname, breweryName, type, abv, ibu, description, brewed);

        AccessDatabase accessDB = new AccessDatabase();

        try {
            accessDB.addBeer(newBI);
        } catch (Exception e) {
            return new JSONObject().append("created", false);
        }

        return new JSONObject().append("created", true);
    }
//    ArrayList<BeerInfo> beers (
//            @RequestParam(value="bname", required = false) String bname,
//            HttpServletResponse httpResponse) throws IOException {
//        AccessDatabase accessDB = new AccessDatabase();
//        ArrayList<BeerInfo> reviews;
//
//        try {
//            httpResponse.setStatus(HttpServletResponse.SC_OK);
//        } catch (Exception e) {
//            reviews = null;
//            httpResponse.setStatus(HttpServletResponse.SC_NOT_FOUND);
//        }
//        return new ArrayList<BeerInfo>();
//    }


}
