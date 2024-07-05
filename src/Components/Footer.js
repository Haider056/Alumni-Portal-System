import * as React from "react";
import facebook from './Assets/footer1.png';
import twitter from './Assets/twitter.png';
import linkedin from './Assets/Linkedin.png';
import instagram from './Assets/instagram.png';
import { Link } from 'react-router-dom';
function Footer() {
  return (
    <div className="flex flex-col items-stretch pl-3 pr-8 pt-3 pb-1 rounded-[50px_50px_0px_0px] max-md:px-3 bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)]" >
      <div className="self-center w-full max-w-[1215px] mt-8 max-md:max-w-full max-md:mt-7">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[21%] max-md:w-full max-md:ml-0">
            <div className="flex flex-col items-stretch max-md:mt-10">
              <div className="text-white text-xl font-medium uppercase whitespace-nowrap">
                Contact US
              </div>
              <div className="text-white text-lg whitespace-nowrap mt-7">
              1 Islamabad Expy <br/> Sector H DHA Phase II<br/> Islamabad
              </div>
              <div className="text-white text-xl whitespace-nowrap mt-4">
              (051) 9075100
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[79%] ml-5 max-md:w-full max-md:ml-0">
            <div className="grow max-md:max-w-full max-md:mt-10">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                <div className="flex flex-col items-stretch w-[26%] max-md:w-full max-md:ml-0">
                  <div className="flex flex-col items-stretch max-md:mt-10">
                    <div className="text-white text-xl font-medium">
                      About us
                    </div>
                    <div className="text-white text-xl whitespace-nowrap mt-7">
                      About University
                    </div>
                    <div className="text-white text-xl mt-5">Our Team</div>
                  </div>
                </div>
                <div className="flex flex-col items-stretch w-[38%] ml-5 max-md:w-full max-md:ml-0">
                  <div className="flex grow flex-col items-stretch max-md:mt-10">
                    <div className="text-white text-xl font-medium">
                      FeedBack
                    </div>
                    <Link to="/Home" className="text-white text-xl font-medium mt-8">
                      Our Projects
                    </Link>
                    <div to="/JobPage" className="text-white text-xl font-medium mt-6">
                      Jobs
                    </div>
                    <div to="/SucessStories" className="text-white text-xl font-medium whitespace-nowrap mt-8">
                      Success Stories
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-stretch w-[36%]  max-md:w-full max-md:ml-0">
                  <div className="flex flex-col items-stretch max-md:mt-10">
                    <div className="text-white text-xl font-medium uppercase">
                      Follow US{" "}
                    </div>
                    <div className="flex items-stretch justify-between gap-2.5 mt-11 max-md:mt-10">
                      <i className="aspect-square object-contain object-center w-[60px] overflow-hidden shrink-0 max-w-full"
                      />
                      <img
                      src={facebook}
                         className="aspect-square object-contain object-center w-[60px] overflow-hidden shrink-0 max-w-full"
                         alt="Facebook logo"
                      />
                      <img
                      src={instagram}
                      alt="Facebook logo"
                         className="aspect-square object-contain object-center w-[60px] overflow-hidden shrink-0 max-w-full"
                      />
                      <img
                      src={linkedin}
                      alt="Facebook logo"
                         className="aspect-square object-contain object-center w-[60px] overflow-hidden shrink-0 max-w-full"
                      />
                       <img
                      src={twitter}
                      alt="Facebook logo"
                         className="aspect-square object-contain object-center w-[60px] overflow-hidden shrink-0 max-w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-white text-base font-medium mr-10 mt-2.5 max-md:max-w-full max-md:mr-2.5">
        Copyright © 2024 IST portal. All rights reserved.
      </div>
    </div>
  );
}


export default Footer;