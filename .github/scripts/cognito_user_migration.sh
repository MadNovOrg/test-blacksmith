#!/usr/bin/env bash 

set -eou pipefail

# Create AWS Cognito User
function create_user() {
    echo "${user} user creation"
    aws cognito-idp admin-create-user \
        --user-pool-id "${user_pool}" \
        --username "${user}" \
        --region "${aws_region}" \
        --user-attributes Name=email,Value="${user}" Name=email_verified,Value=true	\
        --message-action SUPPRESS 2>&1 > /dev/null
}

# Delete AWS Cognito User
function delete_user() {
    echo "${user} user deletion"
    aws cognito-idp admin-delete-user \
        --user-pool-id "${user_pool}" \
        --username "${user}" \
        --region "${aws_region}" 2>&1 > /dev/null
}

# Set AWS Cognito User Password
function user_set_pass() {
    echo "${user} user set password"
    aws cognito-idp admin-set-user-password \
      --user-pool-id "${user_pool}" \
      --username "${user}" \
      --password "${cognito_user_password}" \
      --region "${aws_region}" \
      --permanent 
}

# List all Cognito User Pool users
function cognito_get_users() {
    aws cognito-idp list-users \
      --user-pool-id "${user_pool}" \
      --region "${aws_region}" \
      --query 'Users[*].Username' \
      --output text 
}

# Helper function
function usage() { 
    echo "====================================================================================================================================================================="
    echo -e "Syntax: ${BLUE}$(basename ${0}) [-c <cognito pool id>] [-u <map of users to create>] [-p <cognito new user password>]${ENDCOLOR}" 1>&2
    echo -e "Options:"
    echo -e "${GREEN}-c${ENDCOLOR}   AWS Cognito user pool ID."
    echo -e "${GREEN}-u${ENDCOLOR}   Names of users got from DB through Hasura."
    echo -e "${GREEN}-p${ENDCOLOR}   AWS Cognito user pool password for the new users.(${RED}OPTIONAL - Needed for user creation ONLY${ENDCOLOR})"
    echo "====================================================================================================================================================================="
}

# Main function
# Import/Creation Cognito Users
# Export Cognito Users from DB using Hasura
function main() {
    #Clean Cognito User Pool
    cognito_users=( $(cognito_get_users) )
    echo "All Cognito Users will be deleted"
    for user in ${cognito_users[@]}; do
        delete_user
    done

    sleep 3
    echo "Cognito Users will be recreated according to profile DB table"
    # Create all users retrived from DB profile table
    for user in ${db_users[@]}; do
        # Validate user provides proper email address
        if [[ "${user}" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$ ]]
        then
            create_user
            user_set_pass
        fi
    done
}

# Colors to be used for terminal output
RED="\e[31m"
BLUE="\e[34m"
GREEN="\e[32m"
MAG="\e[35m"
ENDCOLOR="\e[0m"

# Declare vars to avoid input unset errors
user_pool=''
#aws_profile=''
db_users=''
cognito_user_password=''

# Check for NOT any arguments
[ $# -eq 0 ] && usage && exit 1

while getopts ':c:u:p:' OPTION; do
    case "$OPTION" in
        c)
            user_pool="${OPTARG}"  
            echo -e "${MAG}Cognito UserPool (-c)${ENDCOLOR}: ${BLUE}${user_pool}${ENDCOLOR}"
            ;;
        p)
            cognito_user_password="${OPTARG}"  
            echo -e "${MAG}Cognito new user password (-p)${ENDCOLOR}: ${BLUE}${cognito_user_password}${ENDCOLOR}"
            ;;
        u)
            db_users=( ${OPTARG} )
            echo -e "${MAG}Users (-u)${ENDCOLOR}: ${BLUE}${db_users[@]}${ENDCOLOR}"
            ;;
#        a)
#            aws_profile="${OPTARG}"  
#            echo -e "${MAG}AWS profile (-a)${ENDCOLOR}: ${BLUE}${aws_profile}${ENDCOLOR}"
#            ;;
        ?)
            usage
            ;;
        : | *)
            usage
            ;;
    esac
done

# Check for empty arguments
usage_needed=false

[ -z $user_pool ] && echo "Missing argument: -c" && usage_needed=true
[ -z $db_users ] && echo "Missing argument: -u" && usage_needed=true
[ -z $cognito_user_password ] && echo "Missing argument: -p" && usage_needed=true

# Provide AWS cli related vars
#export AWS_PROFILE=${aws_profile}
aws_region='eu-west-2'

main
