import React from 'react';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown } from "rizzui";
import { FiChevronDown } from 'react-icons/fi';

import { Player, PriorityLists, usePlayerStore } from "../../store/player.store";
import { Team, useTeamStore } from "../../store/team.store";
import { useAuthStore } from "../../store/auth.store";
import Axios from '../../config/axios';

const SignUp: React.FC = () => {
  const navigator = useNavigate();

  const { loading, setLoading, teams, setTeams } = useTeamStore() as {
    loading: boolean;
    setLoading: (state: boolean) => void;
    teams: Team[];
    setTeams: (teams: any) => void
  };
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`${import.meta.env.VITE_API_URL}/team/noauth`);
        if (res.status === 200) {
          const allTeams = res.data;
          setTeams(allTeams);
        }
      } catch (err: any) {
        setLoading(false);
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return (
    loading ? (
      <div className="fixed top-0 left-0 z-99999 w-screen h-screen bg-white dark:bg-boxdark flex justify-center items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    ): (
    <>
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-[400px] md:w-2/3 xl:w-2/5 p-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Sign Up
        </h2>
        <Formik initialValues={{
          name: '',
          team_name: '',
          password: '',
          confirmPassword: '',
        }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required('Username is required'),
            // teamname:   ,
            team_name: Yup.string().max(255).required('Team Name is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), undefined], 'Password must match')
              .required('Confirm password is required')
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const data = {
              username: values.name,
              team_name: selectedTeam?.name || values.team_name,
              password: values.password
            }
            console.log("Submitting!!!")
            await axios({
              method: 'post',
              url: `${import.meta.env.VITE_API_URL}/auth/register/`,
              data: data,
              headers: { 'Content-Type': 'application/json' }
            }).then((res) => {
              if (res?.status === 201) {
                setSubmitting(false);
                navigator("/auth/signin");
                toast.success(res.data.message);
              }
            }).catch((err) => {
              setSubmitting(false);
              toast.error(err.response.data.message);
            })
          }}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  User Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name='name'
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.name && errors.name && (
                    <div className='text-warning text-sm mt-2'>{errors.name}</div>
                  )}
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                          fill=""
                        />
                        <path
                          d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Team Name
                </label>
                <div className="relative">
                  {/* <input
                    type="text"
                    name='team_name'
                    value={values.team_name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your team name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  /> */}
                  <Dropdown as="button" className="w-full mt-4">
                    <Dropdown.Trigger className="w-full">
                      <Button
                        variant="outline"
                        className="w-full flex justify-between border text-lg font-normal border-stroke hover:border-primary dark:border-strokedark dark:hover:border-primary"
                      >
                        {selectedTeam === null ? "Select Team" : selectedTeam.name}
                        <FiChevronDown className="ml-2 w-5" />
                      </Button>
                    </Dropdown.Trigger>
                    <Dropdown.Menu className="w-56 border border-stroke dark:border-strokedark drop-shadow-none bg-white dark:text-gray">
                      {teams.map((team, index) => (
                        <Dropdown.Item
                          key={index}
                          className="hover:bg-stroke dark:hover:bg-strokedark"
                          onClick={() => {
                            setSelectedTeam(team);
                            handleChange({target: {name: 'team_name', value: team.name}});
                          }}
                        >
                          {team.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {touched.team_name && errors.team_name && (
                    <div className='text-warning text-sm mt-2'>{errors.team_name}</div>
                  )}
                  
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name='password'
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.password && errors.password && (
                    <div className='text-warning text-sm mt-2'>{errors.password}</div>
                  )}
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name='confirmPassword'
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className='text-warning text-sm mt-2'>{errors.confirmPassword}</div>
                  )}
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign Up"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  disabled={isSubmitting}
                />
              </div>
            </form>
          )}
        </Formik>
        <div className="mt-6 text-center">
          <p>
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  </>)
  );
};

export default SignUp;
