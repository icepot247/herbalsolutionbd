<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</head>
<body>



{{--    <div class="card">--}}
{{--        <div class="card-body">--}}

{{--                <table>--}}
{{--                    <tr>--}}
{{--                        <td>--}}
{{--                            <div>--}}
{{--                                <img src="{{$data['govt']}}" width="10%" height="10%" style="padding: 0 10px; ">--}}
{{--                            </div>--}}
{{--                        </td>--}}
{{--                        <td style="text-transform: uppercase; text-align: center;">--}}
{{--                            <p style="font-size: 18px;">Government of The People's Republic of Bangladesh</p>--}}

{{--                            <p style="font-size: 5px; color: #fff;">.</p>--}}

{{--                            <h4 style="font-size: 17px; font-weight: bold; ">Bangladesh Road Transport Authority (BRTA)</h4>--}}

{{--                            <p style="font-size: 5px; color: #fff;">.</p>--}}
{{--                            <p style="text-transform: capitalize; font-size: 15px;">Circle Name: {{$data['result'][0]->center_name}}</p>--}}
{{--                        </td>--}}
{{--                        <td>--}}
{{--                            <div>--}}
{{--                                <img src="{{$data['logo']}}" width="10%" height="10%" style="padding-left: 10px; ">--}}
{{--                            </div>--}}
{{--                        </td>--}}
{{--                    </tr>--}}
{{--                </table>--}}

{{--                <h4 style="font-weight: bold; text-align: center">Fitness Result </h4>--}}

{{--            </div>--}}
{{--        </div>--}}

        <div class="row" style="padding-top: 0px">
            <h4 class=""><b>Vehicle Information</b></h4>

            <div style="border-top: 1px solid #ddd; ">
                <p style="font-size: 5px; color: #fff;">.</p>
            </div>

            <div class="col-md-12 col-sm-12 border">
                <table class="table table-striped">

                    <tr style="padding-bottom: .5rem">
                        <th style="width: 10rem;padding-bottom: .5rem">Inspection Date</th>
                        <td style="width: 15rem;padding-bottom: .5rem">
                            : {{date("d-M-Y",strtotime($data['result'][0]->inspection_date))}}</td>
                        <th style="width: 8rem;padding-bottom: .5rem">Lane No</th>
                        <td style="padding-bottom: .5rem">: {{$data['result'][0]->lane_no}}</td>
                    </tr>
                    <tr style="padding-bottom: .5rem">
                        <th style="padding-bottom: .5rem">Vehicle Class</th>
                        <td style="padding-bottom: .5rem">: {{$data['result'][0]->vehicle_class_name}}</td>
                        <th style="padding-bottom: .5rem">Lane Type</th>
                        <td style="padding-bottom: .5rem">: {{$data['result'][0]->lane_type_name}}</td>

                    </tr>
                    <tr style="padding-bottom: .5rem">
                        <th style="padding-bottom: .5rem">Registration No</th>
                        <td style="padding-bottom: .5rem">: {{$data['result'][0]->registration_no}}</td>
                    </tr>

                </table>


            </div>

                        <h4 class=" text-center {{ ($data['final_result']->passed_yn == 'Y')?'text-success':'text-danger'}}"><b>FITNESS TEST RESULT:  {{ ($data['final_result']->passed_yn == 'Y' )?'PASS':'FAILED'}}</b></h4>
        </div>


        <div class="row">
            <h4 class=""><b>Item Wise Visual Test Result</b></h4>

            <div style="border-top: 1px solid #ddd; ">
                <p style="font-size: 5px; color: #fff;">.</p>
            </div>

            <div class="col-md-12 col-sm-12 border" >
                <table class="table table-striped border-2" >
                    <thead>
                    <tr>
                        <th style="padding-bottom: .5rem">Test Item</th>
                        <th style="padding-bottom: .5rem">Result</th>
                    </tr>
                    </thead>
                    <tbody>

                    @foreach($data['result'] as $key=>$value)

                          <tr style="border: 1px solid black; padding:1px; margin: 1px">
                              <td style="padding: .5rem;border: 1px solid black;">{{$value->test_item_name}}</td>
                              @if($value->item_result_yn == 'Y')
                                  <td style="padding: .5rem;border: 1px solid black; color: green">PASS</td>
                              @elseif($value->item_result_yn == 'P')
                                  <td style="padding: .5rem;border: 1px solid black; ">PENDING</td>
                              @else
                                  <td style="padding: .5rem;border: 1px solid black; color: red">FAILED</td>
                              @endif

                          </tr>


                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <div style="margin-top: 10px; text-align: center; ">
            <p style="font-size: 12px; font-weight: bold;">THIS IS AN AUTOMATICALLY GENERATED RESULT</p>
        </div>





    <div class="navbar fixed-bottom"></div>

    {{--    <footer>--}}
    {{--        <div class="footer" style="position: absolute; bottom: 0;">--}}
    {{--            <table width="100%">--}}
    {{--                <tr>--}}
    {{--                    <td align="left" style="width: 50%;">--}}
    {{--                        &copy; {{ date('Y') }}  - All rights reserved.--}}
    {{--                    </td>--}}
    {{--                    <td align="right" style="width: 50%;">--}}
    {{--                        Company Slogan--}}
    {{--                    </td>--}}
    {{--                </tr>--}}
    {{--            </table>--}}
    {{--        </div>--}}
    {{--    </footer>--}}

</div>

</body>
</html>
