@extends('report.layout')
@section('content')
    <div class="container">


        <div class="row p-5">
            <h3 style="font-weight: bold; text-align: center">Result Report</h3>
            <p style="font-weight: bold; text-align: center">Generated At ({{date('d-M-Y h:i A')}}) </p>
            <br>
        </div>
        <div class="row">
            <div class="col-md-12 col-sm-12 border">
                <table class="table table-striped border-2">
                    <thead>
                    <tr>
                        <th style="padding-bottom: .5rem">SL</th>
                        <th style="padding-bottom: .5rem">Inspection Date</th>
                        <th style="padding-bottom: .5rem">Center Name</th>
                        <th style="padding-bottom: .5rem">Registration No.</th>
                        <th style="padding-bottom: .5rem">Queue No</th>
                        <th style="padding-bottom: .5rem">Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($data as $key => $value)
                        <tr style="border: 1px solid black; padding:1px; margin: 1px">
                            <td style="padding: .5rem;border: 1px solid black;">{{($key+1)}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value->insert_date}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value['vic_center']['center_name']}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value->registration_no}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value->queue_no}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">
                                @if($value['vehicle_inspection']['passed_yn']=='Y')
                                    <span class="text-success">Passed</span>
                                @else
                                    <span class="text-danger">Pending</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>

    </div>
@stop
