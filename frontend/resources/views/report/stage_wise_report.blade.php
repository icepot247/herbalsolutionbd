@extends('report.layout')
@section('content')
    <div class="container">


        <div class="row p-5">
            <h3 style="font-weight: bold; text-align: center">Stage Wise Report</h3>
            <p style="font-weight: bold; text-align: center">Generated At ({{date('d-M-Y h:i A')}}) </p>
            <br>
        </div>
        <div class="row">
            <div class="col-md-12 col-sm-12 border">
                <table class="table table-striped border-2">
                    <thead>
                    <tr>
                        <th style="padding-bottom: .5rem">SL</th>
                        <th style="padding-bottom: .5rem">Registration No.</th>
                        <th style="padding-bottom: .5rem">Appointment</th>
                        <th style="padding-bottom: .5rem">Last Completed</th>
                        <th style="padding-bottom: .5rem">Lane Queue</th>
                        <th style="padding-bottom: .5rem">Inspection Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($data as $key => $value)
                        <tr style="border: 1px solid black; padding:1px; margin: 1px">
                            <td style="padding: .5rem;border: 1px solid black;">{{($key+1)}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value->registration_no}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value->appointment_id}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{($value->last_completed_step != null)?$value->last_completed_step['testStep']['test_steps_name']:''}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{$value->lane_queue_id}}</td>
                            <td style="padding: .5rem;border: 1px solid black;">{{date('d-M-Y',strtotime($value->inspection_date))}}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>

    </div>
@stop
