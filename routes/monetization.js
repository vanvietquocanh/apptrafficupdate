var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter === "signup"){
		var html = `<form class="formRegister" method="post" action="/">
			            <h1>Registration:</h1>
						<ul class="block-ip">
			                <label for="">Account Email :</label>
			                <input type="text" class="setWith" placeholder="Accunt email" name="email"/>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">Password :</label>
			                <input type="password" class="setWith" placeholder="Password" name="password"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Confirm Password :</label>
			                <input type="password" class="setWith" placeholder="Confirm Password" name="confPassword"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">First Name :</label>
			                <input type="text" class="setWith" placeholder="First Name" name="fname"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Last Name :</label>
			                <input type="text" class="setWith" placeholder="Last Name" name="lastName"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Phone :</label>
			                <input type="tel" class="setWith" placeholder="Phone Number" name="lastName"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Payment Method :</label>
			                <p style="font-size: 11px;">(*) - In order to verify the authenticity of your registration information, please fill out your payment information, we ensure that your payment information will not be disclosed</p>
			                <select class="setWith" name="Country">
			                	<option value="">=== Payment ===</option>
			                	<option value="wire">Wire</option>
			                	<option value="paypal">Paypal</option>
			                </select>
			            </ul>
			            <ul class="block-ip">
			                <label for="">IM :</label>
			                <select class="setWith" name="im">
			                	<option value="">=== IM ===</option>
			                	<option value="qq">QQ</option>
			                	<option value="skype">Skype</option>
			                	<option value="msn">MSN</option>
			                	<option value="gTalk">Gtalk</option>
			                	<option value="weChat">WeChat</option>
			                </select>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Address IM :</label>
			                <input type="text" class="setWith" placeholder="Address IM" name="addressIM"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Address :</label>
			                <input type="text" class="setWith" placeholder="Address" name="address"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Country :</label>
			                <select class="setWith" name="country">
			                    <option value="" selected="selected">Select Country</option>
			                    <option value="af">Afghanistan</option>
			                    <option value="ax">Åland Islands</option>
			                    <option value="al">Albania</option>
			                    <option value="dz">Algeria</option>
			                    <option value="ad">Andorra</option>
			                    <option value="ao">Angola</option>
			                    <option value="ai">Anguilla</option>
			                    <option value="ag">Antigua and Barbuda</option>
			                    <option value="ar">Argentina</option>
			                    <option value="am">Armenia</option>
			                    <option value="aw">Aruba</option>
			                    <option value="au">Australia</option>
			                    <option value="at">Austria</option>
			                    <option value="az">Azerbaijan</option>
			                    <option value="bs">Bahamas</option>
			                    <option value="bh">Bahrain</option>
			                    <option value="bd">Bangladesh</option>
			                    <option value="bb">Barbados</option>
			                    <option value="by">Belarus</option>
			                    <option value="be">Belgium</option>
			                    <option value="bz">Belize</option>
			                    <option value="bj">Benin</option>
			                    <option value="bm">Bermuda</option>
			                    <option value="bt">Bhutan</option>
			                    <option value="bo">Bolivia</option>
			                    <option value="bq">Bonaire, Sint Eustatius and Saba</option>
			                    <option value="ba">Bosnia and Herzegovina</option>
			                    <option value="bw">Botswana</option>
			                    <option value="br">Brazil</option>
			                    <option value="bn">Brunei Darussalam</option>
			                    <option value="bg">Bulgaria</option>
			                    <option value="bf">Burkina Faso</option>
			                    <option value="kh">Cambodia</option>
			                    <option value="cm">Cameroon</option>
			                    <option value="ca">Canada</option>
			                    <option value="cv">Cape Verde</option>
			                    <option value="ky">Cayman Islands</option>
			                    <option value="cf">Central African Republic</option>
			                    <option value="cl">Chile</option>
			                    <option value="cn">China</option>
			                    <option value="cc">Cocos (Keeling) Islands</option>
			                    <option value="co">Colombia</option>
			                    <option value="cr">Costa Rica</option>
			                    <option value="ci">Côte d'Ivoire</option>
			                    <option value="hr">Croatia</option>
			                    <option value="cw">Curaçao</option>
			                    <option value="cy">Cyprus</option>
			                    <option value="cz">Czech Republic</option>
			                    <option value="dk">Denmark</option>
			                    <option value="dj">Djibouti</option>
			                    <option value="dm">Dominica</option>
			                    <option value="do">Dominican Republic</option>
			                    <option value="ec">Ecuador</option>
			                    <option value="eg">Egypt</option>
			                    <option value="sv">El Salvador</option>
			                    <option value="gq">Equatorial Guinea</option>
			                    <option value="ee">Estonia</option>
			                    <option value="et">Ethiopia</option>
			                    <option value="fo">Faroe Islands</option>
			                    <option value="fj">Fiji</option>
			                    <option value="fi">Finland</option>
			                    <option value="fr">France</option>
			                    <option value="gf">French Guiana</option>
			                    <option value="pf">French Polynesia</option>
			                    <option value="gm">Gambia</option>
			                    <option value="ge">Georgia</option>
			                    <option value="de">Germany</option>
			                    <option value="gh">Ghana</option>
			                    <option value="gi">Gibraltar</option>
			                    <option value="gr">Greece</option>
			                    <option value="gl">Greenland</option>
			                    <option value="gd">Grenada</option>
			                    <option value="gp">Guadeloupe</option>
			                    <option value="gu">Guam</option>
			                    <option value="gt">Guatemala</option>
			                    <option value="gg">Guernsey</option>
			                    <option value="gn">Guinea</option>
			                    <option value="gy">Guyana</option>
			                    <option value="ht">Haiti</option>
			                    <option value="hn">Honduras</option>
			                    <option value="hk">Hong Kong</option>
			                    <option value="hu">Hungary</option>
			                    <option value="is">Iceland</option>
			                    <option value="in">India</option>
			                    <option value="id">Indonesia</option>
			                    <option value="ir">Iran</option>
			                    <option value="iq">Iraq</option>
			                    <option value="ie">Ireland</option>
			                    <option value="im">Isle of Man</option>
			                    <option value="il">Israel</option>
			                    <option value="it">Italy</option>
			                    <option value="jm">Jamaica</option>
			                    <option value="jp">Japan</option>
			                    <option value="je">Jersey</option>
			                    <option value="jo">Jordan</option>
			                    <option value="kz">Kazakhstan</option>
			                    <option value="ke">Kenya</option>
			                    <option value="kr">Korea - South</option>
			                    <option value="kw">Kuwait</option>
			                    <option value="kg">Kyrgyzstan</option>
			                    <option value="la">Laos</option>
			                    <option value="lv">Latvia</option>
			                    <option value="lb">Lebanon</option>
			                    <option value="lr">Liberia</option>
			                    <option value="ly">Libya</option>
			                    <option value="li">Liechtenstein</option>
			                    <option value="lt">Lithuania</option>
			                    <option value="lu">Luxembourg</option>
			                    <option value="mo">Macao</option>
			                    <option value="mk">Macedonia</option>
			                    <option value="mg">Madagascar</option>
			                    <option value="mw">Malawi</option>
			                    <option value="my">Malaysia</option>
			                    <option value="mv">Maldives</option>
			                    <option value="ml">Mali</option>
			                    <option value="mt">Malta</option>
			                    <option value="mh">Marshall Islands</option>
			                    <option value="mq">Martinique</option>
			                    <option value="mu">Mauritius</option>
			                    <option value="mx">Mexico</option>
			                    <option value="md">Moldova</option>
			                    <option value="mc">Monaco</option>
			                    <option value="mn">Mongolia</option>
			                    <option value="me">Montenegro</option>
			                    <option value="ms">Montserrat</option>
			                    <option value="ma">Morocco</option>
			                    <option value="mz">Mozambique</option>
			                    <option value="mm">Myanmar</option>
			                    <option value="nr">Nauru</option>
			                    <option value="np">Nepal</option>
			                    <option value="nl">Netherlands</option>
			                    <option value="nc">New Caledonia</option>
			                    <option value="nz">New Zealand</option>
			                    <option value="ni">Nicaragua</option>
			                    <option value="ne">Niger</option>
			                    <option value="ng">Nigeria</option>
			                    <option value="mp">Northern Mariana Islands</option>
			                    <option value="no">Norway</option>
			                    <option value="om">Oman</option>
			                    <option value="pk">Pakistan</option>
			                    <option value="ps">Palestinian Territory</option>
			                    <option value="pa">Panama</option>
			                    <option value="py">Paraguay</option>
			                    <option value="pe">Peru</option>
			                    <option value="ph">Philippines</option>
			                    <option value="pl">Poland</option>
			                    <option value="pt">Portugal</option>
			                    <option value="pr">Puerto Rico</option>
			                    <option value="qa">Qatar</option>
			                    <option value="re">Reunion</option>
			                    <option value="ro">Romania</option>
			                    <option value="ru">Russian Federation</option>
			                    <option value="rw">Rwanda</option>
			                    <option value="kn">Saint Kitts and Nevis</option>
			                    <option value="lc">Saint Lucia</option>
			                    <option value="mf">Saint Martin</option>
			                    <option value="vc">Saint Vincent and the Grenadines</option>
			                    <option value="ws">Samoa</option>
			                    <option value="sa">Saudi Arabia</option>
			                    <option value="sn">Senegal</option>
			                    <option value="rs">Serbia</option>
			                    <option value="sc">Seychelles</option>
			                    <option value="sl">Sierra Leone</option>
			                    <option value="sg">Singapore</option>
			                    <option value="sx">Sint Maarten (Dutch part)</option>
			                    <option value="sk">Slovakia</option>
			                    <option value="si">Slovenia</option>
			                    <option value="so">Somalia</option>
			                    <option value="za">South Africa</option>
			                    <option value="es">Spain</option>
			                    <option value="lk">Sri Lanka</option>
			                    <option value="sd">Sudan</option>
			                    <option value="sr">Suriname</option>
			                    <option value="sz">Swaziland</option>
			                    <option value="se">Sweden</option>
			                    <option value="ch">Switzerland</option>
			                    <option value="sy">Syria</option>
			                    <option value="tw">Taiwan</option>
			                    <option value="tj">Tajikistan</option>
			                    <option value="tz">Tanzania, United Republic of</option>
			                    <option value="th">Thailand</option>
			                    <option value="tl">Timor-Leste</option>
			                    <option value="tt">Trinidad and Tobago</option>
			                    <option value="tn">Tunisia</option>
			                    <option value="tr">Turkey</option>
			                    <option value="tm">Turkmenistan</option>
			                    <option value="tc">Turks and Caicos Islands</option>
			                    <option value="ug">Uganda</option>
			                    <option value="ua">Ukraine</option>
			                    <option value="ae">United Arab Emirates</option>
			                    <option value="uk">United Kingdom</option>
			                    <option value="us">United States</option>
			                    <option value="uy">Uruguay</option>
			                    <option value="uz">Uzbekistan</option>
			                    <option value="vu">Vanuatu</option>
			                    <option value="ve">Venezuela, Bolivarian Republic of</option>
			                    <option value="vn">Vietnam</option>
			                    <option value="vg">Virgin Islands, British</option>
			                    <option value="vi">Virgin Islands, U.S.</option>
			                    <option value="ye">Yemen</option>
			                    <option value="zm">Zambia</option>
			                    <option value="zw">Zimbabwe</option>
			                </select>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Region :</label>
			                <input type="text" class="setWith" placeholder="Region" name="region"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">City :</label>
			                <input type="text" class="setWith" placeholder="City" name="city"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Website :</label>
			                <input type="url" class="setWith" placeholder="Website" name="website"/>
			            </ul>
			            <ul class="block-ip">
			                <label for="">Facebook :</label>
			                <p style="font-size: 11px">(*) - Please enter your personal page url!</p>
			                <input class="setWith" type="url" placeholder="Facebook" name="facebook"></input>
			            </ul>
			            <ul class="block-ip">
			                <label for="">LinkedIn :</label>
			                <p style="font-size: 11px">(*) - Please enter your personal page url!</p>
			                <input class="setWith" type="url" placeholder="LinkedIn" name="linkedin"></input>
			            </ul>
			           	<ul class="block-ip">
			           		<label for="">Account Type :</label>
			           		<label class="flex-label" for="publish">
			           			<input class="account" type="checkbox" id="publish" value="publish" name="accountType" class="" />
								<ul class="">
									<h6>Publish/Developer</h6>
									<p class="sub-account-ip">If you manage a Mobile Site, an iPhone App, an Android App…</p>
								</ul>
			           		</label>
			           		<label class="flex-label" for="buyer">
			           			<input class="account" type="checkbox" id="buyer" value="buyer" name="accountType" class="" />
								<ul class="">
				           			<h6>Media Buyer</h6>
				           			<p class="sub-account-ip">If you buy traffic on other adnetworks to bring users to our CPA campaigns.</p>
			           			</ul>
			           		</label>
			           		<label class="flex-label" for="adNet">
			           			<input class="account" type="checkbox" id="adNet" value="adNet" name="accountType" class="" />
								<ul class="">
				           			<h6>Ad Network</h6>
				           			<p class="sub-account-ip">If you manage a CPC Network to monetize your unsold traffic.</p>
			           			</ul>
			           		</label>
			           		<label class="flex-label" for="affiliate">
			           			<input class="account" type="checkbox" id="affiliate" value="affiliate" name="accountType" class="" />
								<ul class="">
				           			<h6>Affiliate Network</h6>
				           			<p class="sub-account-ip">A CPA Network to import our offers for your own affiliates.</p>
			           			</ul>
			           		</label>
			           		<label class="flex-label" for="other">
			           			<input class="account" type="checkbox" id="other" value="other" name="accountType" class="" />
								<ul class="">
			           				<h6>Other</h6>
			           			</ul>
			           		</label>
			           	</ul>
			            <ul class="block-ip">
			            	<label for="">Career :</label>
			               <select name="career" id="">
			               		<option value=""> -- Career -- </option>
			               		<option value="self">Self-employed</option>
			               		<option value="company">Work In Company</option>
			               </select>
			            </ul>
			            <ul class="block-ip">
			                <label for="">What verticals of offers are you looking for?</label>
							<label for="mobilesubscription">
								<input id="mobilesubscription" type="checkbox" value="mobilesubscription" name="mobilesubscription" />
								Mobile subscription
							</label>
							<label for="appdown">
								<input id="appdown" type="checkbox" value="appdown" name="appdown" />
								App download
							</label>
							<label for="gamedown">
								<input id="gamedown" type="checkbox" value="gamedown" name="gamedown" />
								Game download
							</label>
							<label for="leadgeneration">
								<input id="leadgeneration" type="checkbox" value="leadgeneration" name="leadgeneration" />
								Lead generation
							</label>
							<label for="mcommerce">
								<input id="mcommerce" type="checkbox" value="mcommerce" name="mcommerce" />
								Mcommerce
							</label>
							<label for="other">
								<input id="other" type="checkbox" value="other" name="other" />
								Other
							</label>
			            </ul>
			           	<ul class="block-ip">
			                <label for="">What type of traffic do you use to promote the offers?</label>
							<label for="display">
								<input id="display" type="checkbox" value="display" name="display"/>
								Display
							</label>
							<label for="incent">
								<input id="incent" type="checkbox" value="incent" name="incent"/>
								Incent
							</label>
							<label for="push">
								<input id="push" type="checkbox" value="push" name="push"/>
								Push
							</label>
							<label for="email">
								<input id="email" type="checkbox" value="email" name="email"/>
								Email
							</label>
							<label for="redirect">
								<input id="redirect" type="checkbox" value="redirect" name="redirect"/>
								Redirect
							</label>
							<label for="popup">
								<input id="popup" type="checkbox" value="popup" name="popup"/>
								Pop-up/Under
							</label>
							<label for="native">
								<input id="native" type="checkbox" value="native" name="native"/>
								Native
							</label>
							<label for="appDiscovery">
								<input id="appDiscovery" type="checkbox" value="appDiscovery" name="appDiscovery"/>
								App-Discovery
							</label>
							<label for="other">
								<input id="other" type="checkbox" value="other" name="other"/>
								Other
							</label>
			            </ul>
			           	<ul class="block-ip">
			                <label for="">How much revenue do you usually generate on with other networks per month?</label>
							<label for="revenue">
								<input id="revenue" type="radio" value="less1000" name="revenue" />
								Less than $1000
							</label>
							<label for="revenue">
								<input id="revenue" type="radio" value="1000-5000" name="revenue" />
								$1000~$5000
							</label>
							<label for="revenue">
								<input id="revenue" type="radio" value="5000-10000" name="revenue" />
								$5000-$10000
							</label>
							<label for="revenue">
								<input id="revenue" type="radio" value="10000-50000" name="revenue" />
								$10000-50000
							</label>
							<label for="revenue">
								<input id="revenue" type="radio" value="50000-100000" name="revenue" />
								$50000-100000
							</label>
							<label for="revenue">
								<input id="revenue" type="radio" value="more100000" name="revenue" />
								More than $100000
							</label>
			            </ul>
			            <ul class="block-ip">
			                <label for="">From who or where did you hear about us?</label>
			                <textarea class="setWith area-fixSize" name="introduce"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">What is your method of traffic? IF you are doing mediabuy, please list some ad networks you are using :</label>
			                <textarea class="setWith area-fixSize"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">What kind of offers do you promote?</label>
			                <textarea class="setWith area-fixSize"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">How much revenue do you usually generate on with other networks per month?</label>
							<label for="false">
								<input class="mg-left-3" id="false" type="radio" value="false" name="allowed" />
								No
							</label>
							<label for="true">
								<input class="mg-left-3" id="true" type="radio" value="true" name="allowed" />
								Yes
							</label>
			            </ul>
			            <ul class="block-ip">
			                <label for="">How long have you been in mobile marketing?</label>
			                <textarea class="setWith area-fixSize" name="marketing"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">What are your top 3 markets / geos?</label>
			                <textarea class="setWith area-fixSize" name="geosMarkets"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">Please name your most successful campaigns in the past 3 months</label>
			                <textarea class="setWith area-fixSize" name="campaigns"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">What other affiliate networks do you work with? Please mention your contacts with these affiliate networks</label>
			                <textarea class="setWith area-fixSize" name="contacts"></textarea>         
			            </ul>
			            <ul class="block-ip">
			                <label for="">Verification Code :</label>
			                <input class="setWith" type="text" placeholder="Verification Code" name="captcha"/>
			            </ul>
			            <ul class="block-ip lastBlock">
			                <input type="submit" class="submit"/>
			            </ul>
					</form>`
		res.render("register",{"form" : html});
	}
});

module.exports = router;
