package connect;

import java.net.*;
import java.io.*;
import java.sql.ResultSet;

public class Connect {
	public static void main(String[] args) throws Exception {
        URL url = new URL("http://localhost:8020/");
        String query = "/?/recommendedbeers?userid=1";
//        		"/searchbeers?&breweryname=Parallel%2049";
        URLConnection connection = new URL(url + "?" + query).openConnection();
//        System.out.println(connection.getURL());
        InputStream response = connection.getInputStream();
        BufferedReader in = new BufferedReader(
                new InputStreamReader(
                connection.getInputStream()));
        String resultLine;
        String inputLine;

        while ((resultLine = in.readLine()) != null){
            String[] parseArray = resultLine.split("\\},\\{");
            for(int i=0 ; i < parseArray.length; i++){
            	System.out.println(parseArray[i]);
            }
        }
        in.close();
    }
}