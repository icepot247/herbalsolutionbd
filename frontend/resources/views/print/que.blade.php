@if($data['status'])
<table style="text-align: center; border: solid 1px; padding: 10px">
    <tr>
        <td>
            <h4 style="margin:0 ">Queue No : {{$data['queue_no']}}</h4>
        </td>
    </tr>
    <tr>
        <td >
            {!! $data['qr_img'] !!}

        </td>
    </tr>
    <tr >
        <td style="border-bottom: solid 0.5px; "> <h5>Date : {{$data['insert_date']}}</h5></td>
    </tr>


    <tr >   <td style="font-size: 12px">Queue ID- {{$data['lane_queue_id']}}</td>  </tr>
    <tr >   <td style="font-size: 12px">Appointment- {{$data['appointment_id']}}</td>  </tr>
    <tr >   <td style="font-size: 12px">Vehicle Class- {{$data['vehicle_class']}}</td>  </tr>
    <tr >   <td style="font-size: 12px">Registration No- {{$data['registration_no']}}</td>  </tr>

</table>
@else
<h1 style="text-align: center; color: red">Invalid Appointment</h1>
@endif
