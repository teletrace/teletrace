import { Stack } from "@mui/material";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
  
  
export const Charts = () => {
  return (
    <Stack
      direction="row"                    
      alignItems="center"
      sx={{ display: 'flex', width: '100%', height: '20vh' }} 
      spacing={1}
    >              
      <div style={{ flex: '1', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[{name: 'Page A', uv: 400, pv: 2400, amt: 2400}]}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: '1', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[{name: 'Page A', uv: 400, pv: 2400, amt: 2400}]}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: '1', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[{name: 'Page A', uv: 400, pv: 2400, amt: 2400}]}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Stack>
  );
};
