import { Container } from "@/components/ecom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import React from "react";



const Profile = () => {
  return <>
  
  <Container>  <div className="flex mt-20">

    <div className="w-1/6 p-4 mt-6">
      <ul className="space-y-4">
        <li>PROFILE</li>
        <li>ORDERS</li>
        <li>MY ADDRESSES</li>
      </ul>
    </div>


    <div className="w-3/6 p-4">

       <p className="p-4 text-sm lg:text-xl font-semibold bg-neutral-200 w-100 rounded-md">PERSONAL INFORMATION</p>

       <div className="flex flex-wrap gap-4 mt-2 p-6">

          <div className="flex w-full gap-4">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input className="h-12" type="text" id="name" placeholder="Name" />
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input className="h-12" type="phone" id="phone" placeholder="Phone" />
            </div>
          </div>

          <div className="flex w-full gap-4">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input className="h-12" type="text" id="name" placeholder="Name" />
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input className="h-12" type="phone" id="phone" placeholder="Phone" />
            </div>
          </div>

           
          <div className="grid w-[480px] items-center">
            <Label htmlFor="message">Address Detail</Label>
            <Textarea className="h-28" placeholder="Type your message here." id="message" />
         </div>
         
         

       </div>


      <div className="text-end">
            <Button>Save My Detail</Button>
      </div>
    </div> 

    </div>
    
    </Container>
  
  
  
  </>
};

export default Profile;
