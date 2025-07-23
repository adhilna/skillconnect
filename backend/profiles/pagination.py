from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6               # show 6 results per page
    page_size_query_param = 'page_size'  # allow client to change page size optionally
    max_page_size = 100         # max allowed page size to prevent abuse
