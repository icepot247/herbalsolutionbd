@if( $data['certificate'])

    <table><tr ><td style="padding-top: 5px">{!! $data['qr_img'] !!}</td></tr></table>

<table style="width: 535px; padding: 28px 55px 0 25px; font-size: 10px; line-height: 1.35rem;">
    <thead>

    </thead>
    <tbody>

    <tr>{{--  Two column  --}}
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="2">{{$data['certificate']->vehicle_id}}</td>
        <td colspan="7"><span style="width: 5px; color: white;">Wh</span>{{$data['certificate']->person_id}}</td>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="2">{{$data['certificate']->v_reg_no}}</td>
        <td colspan="7"><span style="width: 30px; color: white;">WhiteWhi</span>{{$data['certificate']->fc_certificate_no}}</td>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="9">{{$data['certificate']->vehicle_class_name.'  '.$data['certificate']->manufacturer_name.'  '.$data['certificate']->manufacturer_year}}</td>
    </tr>

    <tr>{{-- Three column --}}
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="1">{{$data['certificate']->chassis_no}} </td>
        <th colspan="3" style="text-align: right;">{{($data['certificate']->hire_yn == 'Y') ? 'Yes': 'No'}}<span style="color: white;">ona</span></th>
        <td colspan="5"><span style="width: 25px; color: white;">Whiteeee</span>{{$data['certificate']->no_of_seats}}</td>
    </tr>

    <tr>{{-- Three column --}}
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="1">{{$data['certificate']->engine_no}} </td>
        <td colspan="3" style="text-align: right;">{{$data['certificate']->number_of_cylinder}}<span style="color: white;">tona</span></td>
        <td colspan="5"><span style="width: 25px; color: white;">White</span>{{$data['certificate']->cc}} </td>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td >{{$data['certificate']->unladen_weight}}</td>
        <td colspan="2" style="text-align: left;"><span style="color: white;">sssss</span>{{$data['certificate']->laden_weight}}</td>
        <td colspan="4" style="text-align: left;"><span style="color: white;">S</span>{{$data['certificate']->colour_name}}</td>

    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td></td>
        <td colspan="8"><span style="width: 30px; color: white;">Whiteeeeee</span></td>
    </tr>

    <tr style="text-align: left;">
        <th style="width:45px;"></th>
        <td></td>
        <td style="text-align: center; ">{{$data['certificate']->vehicle_lenght}} </td>
        <td style="text-align: center;"><span style="color: white;">Whiteee</span>{{$data['certificate']->vehicle_height}}</td>
        <td colspan="2"></td>
        <td colspan="2">{{$data['certificate']->vehicle_width}}</td>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td style="text-align: center; "> </td>
        <td style="text-align: right;"><span style="color: white;">Whitee</span></td>
    </tr>
    <tr>
        <th></th>
    </tr>

    <tr>
        <th style="width:45px; "></th>
        <td></td>
        <td colspan="9" >{{$data['certificate']->person_name}}</td>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="9">{{$data['certificate']->father_name}}</td>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td></td>
        <td colspan="9">{{$data['certificate']->person_address}}</td>
    </tr>

    <tr>
        <th></th>
    </tr>
    <tr>
        <th></th>
    </tr>
    <tr>
        <th></th>
    </tr>
    <tr>
        <th></th>
    </tr>
    <tr>
        <th></th>
    </tr>

    <tr>
        <th style="width:45px;"></th>
        <td colspan="10"><span style="color: white;">s</span></td>
    </tr>

    <tr>
        <th style="width:35px !important;"></th>
        <td colspan="10">{{($data['certificate']->account_no != '') ? $data['certificate']->account_no: 'N/A'}}</td>
    </tr>

    <tr><th></th></tr>
    <tr><th></th></tr>
    <tr><th></th></tr>
    <tr><th></th></tr>

    <tr>
        <td colspan="11"><span style="color: white;">So</span>{{date("d/m/Y",strtotime($data['certificate']->issue_date))}}</td>
    </tr>
    <tr>
        <td colspan="11"><span style="color: white;">So</span>{{date("d/m/Y",strtotime($data['certificate']->expiry_date))}}</td>
    </tr>

    <tr>
        <td colspan="3">
            <table>
                <tr>
                    <td></td>
                </tr>
                <tr style="line-height: 1rem;">
                    <td><span style="color: white;">o</span>{{date("d/m/Y",strtotime($data['certificate']->issue_date))}}</td>
                </tr>
            </table>
        </td>
        <td colspan="8">
            <table>
                <tr>
                    <td>{{$data['certificate']->approved_by_name}}</td>
                </tr>
                <tr>
                    <td style="line-height: 2rem !important; margin-top:3px;" >{{$data['certificate']->designation_name}}</td>
                </tr>
                <tr>
                    <td style="line-height: 2rem !important; margin-top:3px;" >{{$data['certificate']->branch_name}} (Automated Certificated)</td>
                </tr>
            </table>
        </td>
    </tr>


    </tbody>
</table>
@else
    <h2 style="text-align: center"> No Data Found !</h2>
@endif
