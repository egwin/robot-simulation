##REST API

1) To start robot simulation
```sh
URL: <base_URL>/app/start
Method: PUT
URL Params: 
    *Required:
        place=[x,y,d] where x and y are number, d is string in 'N','S','E','W'
    Optional:
        ntag=[string] where robot name tag is change, default=robot1 
        bsize=[8x8] where the board size is 8x8, default is 5x5
```
Example: - to start the robot simulation by placing on x=0, y=0 and facing west 
<base_URL>/app/start?bsize=8x8&place=0,0,W

#
2) To end robot simulation
```sh
URL: <base_URL>/app/end
Method: PUT
URL Params: 
    Optional:
        ntag=[string] where robot name tag is change, default=robot1 
```
Example: - to end the robot simulation 
<base_URL>/app/end

#
3) To change the connection status of robot simulation
```sh
URL: <base_URL>/app/power
Method: PUT
URL Params: 
    *Required:
        state=[online | offline]
    Optional:
        ntag=[string] where robot name tag is change, default=robot1
```
Example: - to disconnect the robot simulation by setting the power off
<base_URL>/app/power?state=offline

#
4) To perform one or more action commands for the robot
```sh
URL: <base_URL>/ctrl/action
Method: PUT
URL Params: 
    *Required:
        cmd=[move | right | left | back]
    Optional:
        ntag=[string] where robot name tag is change, default=robot1
```
Example1: - move the robot one step forward
<base_URL>/ctrl/action?cmd=move

Example2: - move the robot two step forward and turn to right
<base_URL>/ctrl/action?cmd=move,move,right

#
5) To get the status of robot
```sh
URL: <base_URL>/status/report
Method: GET
URL Params: 
    Optional:
        ntag=[string] where robot name tag is change, default=robot1
        show=[all]
```
Example1: - get the status of the robot
<base_URL>/status/report?show=all


